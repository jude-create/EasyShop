import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Order } from '../../types/order';
import { formatPrice } from '../../constants/products';
import FlowStatusBadge from './FlowStatusBadge';

interface FlowOrderCardProps {
  order: Order;
  colors: {
    card: string;
    border: string;
    subtle: string;
    text: string;
    textMuted: string;
    textSecondary: string;
    primary: string;
  };
  isDark: boolean;
  onPress: () => void;
}

export default function FlowOrderCard({
  order,
  colors,
  isDark,
  onPress,
}: FlowOrderCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: colors.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 14,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
        }}
      >
        <View>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>{order.id}</Text>
          <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{order.date}</Text>
        </View>
        <FlowStatusBadge status={order.status} colors={colors} isDark={isDark} />
      </View>

      <View style={{ padding: 14, gap: 8 }}>
        {order.items.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                backgroundColor: colors.subtle,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text }} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>Qty: {item.qty}</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary }}>
              {formatPrice(item.price * item.qty)}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 11,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          backgroundColor: colors.subtle,
        }}
      >
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>
          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 13, fontWeight: '800', color: colors.text }}>
            {formatPrice(order.subtotal + order.delivery)}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

