import { Text, View } from 'react-native';
import { CartItem } from '../../context/CartContext';
import ReviewItemRow from './ReviewItemRow';

interface ReviewItemsCardProps {
  colors: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    primary: string;
  };
  cart: CartItem[];
  totalItems: number;
}

export default function ReviewItemsCard({
  colors,
  cart,
  totalItems,
}: ReviewItemsCardProps) {
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 16, borderWidth: 0.5, borderColor: colors.border, marginBottom: 12, overflow: 'hidden' }}>
      <View style={{ padding: 14, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
          {totalItems} Item{totalItems !== 1 ? 's' : ''}
        </Text>
      </View>
      {cart.map((item, index) => (
        <ReviewItemRow
          key={item.id}
          item={item}
          colors={colors}
          showDivider={index < cart.length - 1}
        />
      ))}
    </View>
  );
}
