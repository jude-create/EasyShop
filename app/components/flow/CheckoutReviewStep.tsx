import { CartItem } from '../../context/CartContext';
import { Text, View } from 'react-native';
import ReviewItemsCard from './ReviewItemsCard';
import ReviewAddressCard from './ReviewAddressCard';
import ReviewSummaryCard from './ReviewSummaryCard';

interface AddressState {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
}

interface CheckoutReviewStepProps {
  colors: {
    card: string;
    border: string;
    subtle: string;
    text: string;
    textMuted: string;
    textSecondary: string;
    primary: string;
    green: string;
  };
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  delivery: number;
  address: AddressState;
}

export default function CheckoutReviewStep({
  colors,
  cart,
  totalItems,
  totalPrice,
  delivery,
  address,
}: CheckoutReviewStepProps) {
  return (
    <View>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 16, letterSpacing: -0.3 }}>
        Order Review
      </Text>
      <ReviewItemsCard colors={colors} cart={cart} totalItems={totalItems} />
      <ReviewAddressCard colors={colors} address={address} />
      <ReviewSummaryCard colors={colors} totalPrice={totalPrice} delivery={delivery} />
    </View>
  );
}
