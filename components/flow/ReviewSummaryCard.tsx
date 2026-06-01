import { Text, View } from 'react-native';
import { formatPrice } from '../../constants/products';
import ReviewSummaryRow from './ReviewSummaryRow';

interface ReviewSummaryCardProps {
  colors: {
    card: string;
    border: string;
    text: string;
    textSecondary: string;
    primary: string;
    green: string;
  };
  totalPrice: number;
  delivery: number;
}

export default function ReviewSummaryCard({
  colors,
  totalPrice,
  delivery,
}: ReviewSummaryCardProps) {
  const grand = totalPrice + delivery;

  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 14, borderWidth: 0.5, borderColor: colors.border, padding: 14 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Price Summary</Text>
      <View style={{ gap: 8 }}>
        <ReviewSummaryRow colors={colors} label="Subtotal" value={formatPrice(totalPrice)} />
        <ReviewSummaryRow
          colors={colors}
          label="Delivery"
          value={delivery === 0 ? 'FREE' : formatPrice(delivery)}
          valueColor={delivery === 0 ? colors.green : colors.text}
        />
        <View style={{ height: 0.5, backgroundColor: colors.border }} />
        <ReviewSummaryRow
          colors={colors}
          label="Total"
          value={formatPrice(grand)}
          emphasize
          valueColor={colors.primary}
        />
      </View>
    </View>
  );
}
