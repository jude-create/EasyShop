import { requestStrapiJson } from './strapiClient';

export interface InitializePaystackPaymentInput {
  amount: number;
  email: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export interface InitializedPaystackPayment {
  authorizationUrl: string;
  accessCode?: string;
  reference: string;
}

export interface VerifiedPaystackPayment {
  verified: boolean;
  status: string;
  reference: string;
  amount: number;
  expectedAmount?: number;
  currency?: string;
  gatewayResponse?: string;
  paidAt?: string;
  channel?: string;
  amountMatches?: boolean;
}

export async function initializePaystackPayment(
  input: InitializePaystackPaymentInput,
): Promise<InitializedPaystackPayment> {
  return requestStrapiJson<InitializedPaystackPayment>('/api/payments/initialize', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function verifyPaystackPayment(
  reference: string,
  expectedAmount: number,
): Promise<VerifiedPaystackPayment> {
  const encodedReference = encodeURIComponent(reference);
  return requestStrapiJson<VerifiedPaystackPayment>(
    `/api/payments/verify/${encodedReference}?amount=${encodeURIComponent(String(expectedAmount))}`,
  );
}
