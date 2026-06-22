import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useOrderHistory } from '../../context/OrderHistoryContext';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { notifyOrderPlaced } from '../../lib/notifications';
import { processPaystackCheckout, type PaymentFeedback } from '../../lib/paystackCheckout';
import FlowScreenHeader from '../../components/flow/FlowScreenHeader';
import FlowStepper from '../../components/flow/FlowStepper';
import CheckoutDeliveryStep from '../../components/flow/CheckoutDeliveryStep';
import CheckoutPaymentStep, { PayMethod } from '../../components/flow/CheckoutPaymentStep';
import CheckoutReviewStep from '../../components/flow/CheckoutReviewStep';
import CheckoutPaymentStatusBanner from '../../components/flow/CheckoutPaymentStatusBanner';
import CheckoutFooter from '../../components/flow/CheckoutFooter';

const STEPS = ['Delivery', 'Payment', 'Review'];
const INITIAL_PAYMENT_FEEDBACK: PaymentFeedback = { status: 'idle', message: '' };

export default function CheckoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const { recordOrder } = useOrderHistory();
  const { profile } = useProfile();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentFeedback, setPaymentFeedback] = useState<PaymentFeedback>(INITIAL_PAYMENT_FEEDBACK);
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', state: '' });
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const delivery = totalPrice >= 500000 ? 0 : 5000;
  const grand = totalPrice + delivery;

  const getPaymentLabel = () => {
    if (payMethod === 'transfer') return 'Bank Transfer';
    if (payMethod === 'cash') return 'Pay on Delivery';
    return 'Paystack Card';
  };

  const processCardPayment = () =>
    processPaystackCheckout({
      amount: grand,
      email: profile?.email || 'test.customer@easyshoppos.dev',
      totalItems,
      customerName: address.name,
      onFeedback: setPaymentFeedback,
    });

  const handlePlaceOrder = async () => {
    if (loading) return;

    setLoading(true);

    try {
      let paymentMethod = getPaymentLabel();

      if (payMethod === 'card') {
        const payment = await processCardPayment();
        if (!payment) {
          return;
        }

        paymentMethod = `Paystack Card (${payment.reference})`;
      }

      const placedOrder = await recordOrder({
        cart,
        delivery,
        paymentMethod,
        address,
      });

      // Checkout is complete once the verified order is recorded. Notification
      // delivery is optional and must never block cart clearing or navigation.
      void notifyOrderPlaced({
        expoPushToken: profile?.expoPushToken,
        title: 'Order confirmed',
        body: `Your order ${placedOrder.id} was placed successfully.`,
        orderId: placedOrder.id,
      }).catch((error) => {
        if (__DEV__) {
          console.warn('[notifications] order confirmation failed', error);
        }
      });

      clearCart();
      router.replace('/orderSuccess');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Payment could not be completed.';
      setPaymentFeedback({ status: 'failed', message: `${message} No order was recorded.` });
      Alert.alert('Payment failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <FlowScreenHeader
          colors={colors}
          title="Checkout"
          onBack={() => (step === 0 ? router.back() : setStep((current) => current - 1))}
          subtitle={`${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        />

        <FlowStepper colors={colors} steps={STEPS} currentStep={step} />

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <CheckoutPaymentStatusBanner colors={colors} feedback={paymentFeedback} />

          {step === 0 && (
            <CheckoutDeliveryStep
              colors={colors}
              delivery={delivery}
              address={address}
              onChange={setAddress}
            />
          )}
          {step === 1 && (
            <CheckoutPaymentStep
              colors={colors}
              total={grand}
              payMethod={payMethod}
              onPayMethodChange={setPayMethod}
              card={card}
              onCardChange={setCard}
            />
          )}
          {step === 2 && (
            <CheckoutReviewStep
              colors={colors}
              cart={cart}
              totalItems={totalItems}
              totalPrice={totalPrice}
              delivery={delivery}
              address={address}
            />
          )}
        </ScrollView>

        <CheckoutFooter
          colors={colors}
          step={step}
          loading={loading}
          grandTotal={grand}
          payMethod={payMethod}
          onNext={() => setStep((current) => current + 1)}
          onPlaceOrder={handlePlaceOrder}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
