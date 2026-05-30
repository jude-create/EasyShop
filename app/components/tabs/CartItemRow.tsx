import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CartItem } from '../../context/CartContext';
import { formatPrice } from '../../constants/products';

interface CartItemRowProps {
  item: CartItem;
  colors: {
    card: string;
    border: string;
    subtle: string;
    primary: string;
    text: string;
    textMuted: string;
    textSecondary: string;
  };
  isDark: boolean;
  onRemove: (id: number) => void;
  onDecrease: (id: number) => void;
  onIncrease: (id: number) => void;
}

export default function CartItemRow({
  item,
  colors,
  isDark,
  onRemove,
  onDecrease,
  onIncrease,
}: CartItemRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 12,
        gap: 12,
        borderWidth: 0.5,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.04,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 12,
          backgroundColor: colors.subtle,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: 28 }}>{item.emoji}</Text>
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 2 }} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>
          {formatPrice(item.priceValue * item.quantity)}
        </Text>
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
          {item.price} each
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end', gap: 8 }}>
        <TouchableOpacity onPress={() => onRemove(item.id)}>
          <Ionicons name="trash-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => onDecrease(item.id)}
            style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.subtle, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="remove" size={14} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ width: 28, textAlign: 'center', fontWeight: '700', fontSize: 14, color: colors.text }}>
            {item.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => onIncrease(item.id)}
            style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="add" size={14} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

