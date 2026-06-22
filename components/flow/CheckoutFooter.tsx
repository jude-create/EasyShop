import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import type { AppColors } from '../../context/ThemeContext';
import { formatPrice } from '../../constants/products';
import type { PayMethod } from './CheckoutPaymentStep';

interface CheckoutFooterProps {
  colors: AppColors;
  step: number;
  loading: boolean;
  grandTotal: number;
  payMethod: PayMethod;
  onNext: () => void;
  onPlaceOrder: () => void;
}

export default function CheckoutFooter({
  colors,
  step,
  loading,
  grandTotal,
  payMethod,
  onNext,
  onPlaceOrder,
}: CheckoutFooterProps) {
  return (
    <View style={{ padding: 16, backgroundColor: colors.card, borderTopWidth: 0.5, borderTopColor: colors.border }}>
      {step < 2 ? (
        <TouchableOpacity
          onPress={onNext}
          style={{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>
            {step === 0 ? 'Continue to Payment' : 'Review Order'}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={onPlaceOrder}
          disabled={loading}
          style={{ backgroundColor: colors.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center', opacity: loading ? 0.8 : 1 }}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>
              {payMethod === 'card' ? 'Pay with Paystack' : 'Place Order'} - {formatPrice(grandTotal)}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
