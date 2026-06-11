import { Text, TouchableOpacity, View } from 'react-native';
import type { Order } from '../../types/order';

interface LatestOrderCardProps {
  colors: {
    card: string;
    subtle: string;
    primary: string;
    primaryLight: string;
    green: string;
    greenLight: string;
    danger: string;
    dangerLight: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
  };
  isDark: boolean;
  order?: Order;
  loading: boolean;
  onViewOrders: () => void;
  onKeepShopping: () => void;
}

export default function LatestOrderCard({
  colors,
  isDark,
  order,
  loading,
  onViewOrders,
  onKeepShopping,
}: LatestOrderCardProps) {
  const total = order ? order.subtotal + order.delivery : 0;

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: -18,
        backgroundColor: colors.card,
        borderRadius: 22,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: isDark ? 0.2 : 0.06,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <View>
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
            Latest activity
          </Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text, letterSpacing: -0.3, marginTop: 2 }}>
            {loading ? 'Loading your account' : order ? order.id : 'No recent orders'}
          </Text>
        </View>
        <TouchableOpacity onPress={onViewOrders}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>View orders</Text>
        </TouchableOpacity>
      </View>

      {order ? (
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 13, color: colors.textSecondary, marginBottom: 4 }}>Status</Text>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{order.status}</Text>
            </View>
            <View
              style={{
                backgroundColor:
                  order.status === 'Delivered'
                    ? colors.greenLight
                    : order.status === 'Cancelled'
                      ? colors.dangerLight
                      : colors.primaryLight,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color:
                    order.status === 'Delivered'
                      ? colors.green
                      : order.status === 'Cancelled'
                        ? colors.danger
                        : colors.primary,
                }}
              >
                {order.date}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, backgroundColor: colors.subtle, borderRadius: 16, padding: 12 }}>
              <Text style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>Items</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>{order.items.length}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: colors.subtle, borderRadius: 16, padding: 12 }}>
              <Text style={{ fontSize: 11, color: colors.textMuted, marginBottom: 4 }}>Total</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>₦{total.toLocaleString('en-NG')}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={onViewOrders}
              activeOpacity={0.85}
              style={{
                flex: 1,
                backgroundColor: colors.primary,
                borderRadius: 14,
                paddingVertical: 13,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 13, fontWeight: '800' }}>Open orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onKeepShopping}
              activeOpacity={0.85}
              style={{
                paddingHorizontal: 16,
                borderRadius: 14,
                paddingVertical: 13,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.subtle,
              }}
            >
              <Text style={{ color: colors.text, fontSize: 13, fontWeight: '700' }}>Keep shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
            Your latest order and status will appear here after checkout.
          </Text>
        </View>
      )}
    </View>
  );
}
