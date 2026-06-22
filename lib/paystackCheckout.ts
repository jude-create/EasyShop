import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { formatPrice } from '../constants/products';
import { initializePaystackPayment, verifyPaystackPayment, type VerifiedPaystackPayment } from './payments';

export type PaymentStatus = 'idle' | 'opening' | 'verifying' | 'success' | 'failed' | 'cancelled';

export interface PaymentFeedback {
  status: PaymentStatus;
  message: string;
}

interface ProcessPaystackCheckoutInput {
  amount: number;
  email: string;
  totalItems: number;
  customerName: string;
  onFeedback: (feedback: PaymentFeedback) => void;
}

function getPaymentReferenceFromUrl(url: string) {
  const parsed = Linking.parse(url);
  const reference = parsed.queryParams?.reference || parsed.queryParams?.trxref;
  return Array.isArray(reference) ? reference[0] : reference || null;
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getPaymentErrorMessage(error: unknown) {
  const rawMessage = error instanceof Error ? error.message : String(error || '');
  const normalized = rawMessage.toLowerCase();

  if (
    normalized.includes('local_rate_limited') ||
    normalized.includes('rate_limited') ||
    normalized.includes('too many requests')
  ) {
    return 'Paystack is temporarily rate limiting payment requests. Please wait about a minute, then try again.';
  }

  return rawMessage || 'Payment could not be completed.';
}

function isRateLimitError(error: unknown) {
  return getPaymentErrorMessage(error).toLowerCase().includes('rate limiting');
}

async function verifyPaymentWithRetry({
  amount,
  reference,
  onFeedback,
  maxAttempts = 3,
}: {
  amount: number;
  reference: string;
  onFeedback: (feedback: PaymentFeedback) => void;
  maxAttempts?: number;
}) {
  let lastVerification: VerifiedPaystackPayment | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    onFeedback({ status: 'verifying', message: `Verifying payment with Paystack... (${attempt}/${maxAttempts})` });

    try {
      lastVerification = await verifyPaystackPayment(reference, amount);
    } catch (error) {
      if (isRateLimitError(error) && attempt < maxAttempts) {
        onFeedback({
          status: 'verifying',
          message: 'Payment completed. Paystack is asking us to wait before confirming it...',
        });
        await wait(10000 * attempt);
        continue;
      }

      throw new Error(getPaymentErrorMessage(error));
    }

    if (lastVerification.verified) {
      return lastVerification;
    }

    if (attempt < maxAttempts) {
      await wait(3000);
    }
  }

  return lastVerification;
}

export async function processPaystackCheckout({
  amount,
  email,
  totalItems,
  customerName,
  onFeedback,
}: ProcessPaystackCheckoutInput): Promise<VerifiedPaystackPayment | null> {
  const callbackUrl = Linking.createURL('payment-callback');

  onFeedback({ status: 'opening', message: 'Opening Paystack test checkout...' });
  let initialized;

  try {
    initialized = await initializePaystackPayment({
      amount,
      email,
      callbackUrl,
      metadata: {
        totalItems,
        customerName,
      },
    });
  } catch (error) {
    const message = getPaymentErrorMessage(error);
    onFeedback({ status: 'failed', message });
    throw new Error(message);
  }

  const paymentResult = await WebBrowser.openAuthSessionAsync(initialized.authorizationUrl, callbackUrl);
  const callbackReference = paymentResult.type === 'success'
    ? getPaymentReferenceFromUrl(paymentResult.url)
    : null;
  const reference = callbackReference || initialized.reference;

  if (paymentResult.type !== 'success') {
    // Android can report a dismissed browser session even after Paystack completed
    // the transaction, so verify the initialized reference before cancelling.
    onFeedback({
      status: 'verifying',
      message: 'Confirming the completed payment with Paystack...',
    });
    await wait(5000);
    const fallbackVerification = await verifyPaymentWithRetry({
      amount,
      reference,
      onFeedback,
      maxAttempts: 3,
    });

    if (fallbackVerification?.verified) {
      onFeedback({
        status: 'success',
        message: `Payment verified. Reference: ${fallbackVerification.reference}`,
      });
      return fallbackVerification;
    }

    onFeedback({
      status: 'cancelled',
      message: `The payment window closed and Paystack did not confirm a successful payment. Reference: ${reference}. No order was recorded.`,
    });
    return null;
  }

  const verification = await verifyPaymentWithRetry({ amount, reference, onFeedback });

  if (!verification?.verified) {
    if (!verification) {
      onFeedback({
        status: 'failed',
        message: `Payment could not be verified. Reference: ${reference}. No order was recorded.`,
      });
      return null;
    }

    const reason = verification.amountMatches === false
      ? `Payment amount did not match this order. Expected ${formatPrice(amount)}, Paystack returned ${formatPrice(verification.amount)}.`
      : verification.gatewayResponse || `Paystack status was ${verification.status || 'unknown'}.`;

    onFeedback({
      status: 'failed',
      message: `${reason} Reference: ${reference}. No order was recorded.`,
    });
    return null;
  }

  onFeedback({ status: 'success', message: `Payment verified. Reference: ${verification.reference}` });
  return verification;
}
