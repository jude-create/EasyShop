import { Text, View } from 'react-native';
import { CartItem } from '../../context/CartContext';
import { formatPrice } from '../../constants/products';

interface ReviewItemRowProps {
  item: CartItem;
  colors: {
    text: string;
    textMuted: string;
    primary: string;
    border: string;
  };
  showDivider: boolean;
}

export default function ReviewItemRow({ item, colors, showDivider }: ReviewItemRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        gap: 10,
        borderBottomWidth: showDivider ? 0.5 : 0,
        borderBottomColor: colors.border,
      }}
    >
      <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text }} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 11, color: colors.textMuted }}>Qty: {item.quantity}</Text>
      </View>
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>
        {formatPrice(item.priceValue * item.quantity)}
      </Text>
    </View>
  );
}

