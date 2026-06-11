import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useOrderHistory } from '../../context/OrderHistoryContext';
import { useProfile } from '../../context/ProfileContext';
import { useTheme } from '../../context/ThemeContext';
import { formatPrice } from '../../constants/products';
import { notifyOrderPlaced } from '../../lib/notifications';
import FlowScreenHeader from '../../components/flow/FlowScreenHeader';
import FlowStepper from '../../components/flow/FlowStepper';
import CheckoutDeliveryStep from '../../components/flow/CheckoutDeliveryStep';
import CheckoutPaymentStep, { PayMethod } from '../../components/flow/CheckoutPaymentStep';
import CheckoutReviewStep from '../../components/flow/CheckoutReviewStep';

const STEPS = ['Delivery', 'Payment', 'Review'];

export default function CheckoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { cart, totalPrice, totalItems, clearCart } = useCart();
  const { recordOrder } = useOrderHistory();
  const { profile } = useProfile();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', state: '' });
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const delivery = totalPrice >= 500000 ? 0 : 5000;
  const grand = totalPrice + delivery;

  const getPaymentLabel = () => {
    // Convert the selected payment method into a readable label for order history and receipts.
    if (payMethod === 'transfer') return 'Bank Transfer';
    if (payMethod === 'cash') return 'Pay on Delivery';

    const last4 = card.number.replace(/\s/g, '').slice(-4);
    return last4 ? `Card •••• ${last4}` : 'Card';
  };

  const handlePlaceOrder = async () => {
    // Record the order first so checkout history is preserved before navigation clears the cart.
    setLoading(true);
    const placedOrder = await recordOrder({
      cart,
      delivery,
      paymentMethod: getPaymentLabel(),
      address,
    });

    // Fire a user-facing notification so the customer gets immediate feedback after checkout.
    await notifyOrderPlaced({
      expoPushToken: profile?.expoPushToken,
      title: 'Order confirmed',
      body: `Your order ${placedOrder.id} was placed successfully.`,
      orderId: placedOrder.id,
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    clearCart();
    router.replace('/orderSuccess');
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

        {/* The stepper keeps delivery, payment, and review clearly separated for the user. */}
        <FlowStepper colors={colors} steps={STEPS} currentStep={step} />

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {step === 0 && (
            // Step 1 collects the delivery address and calculates shipping.
            <CheckoutDeliveryStep
              colors={colors}
              delivery={delivery}
              address={address}
              onChange={setAddress}
            />
          )}
          {step === 1 && (
            // Step 2 captures the chosen payment method and card details when needed.
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
            // Step 3 presents the final review before the order is recorded.
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

        <View style={{ padding: 16, backgroundColor: colors.card, borderTopWidth: 0.5, borderTopColor: colors.border }}>
          {step < 2 ? (
            <TouchableOpacity
              onPress={() => setStep((current) => current + 1)}
              style={{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}
              activeOpacity={0.85}
            >
              <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>
                {step === 0 ? 'Continue to Payment' : 'Review Order'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={handlePlaceOrder}
              disabled={loading}
              style={{ backgroundColor: colors.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center', opacity: loading ? 0.8 : 1 }}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>
                  Place Order · {formatPrice(grand)}
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
