import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OrderStatus } from '../../types/order';

interface FlowStatusBadgeProps {
  status: OrderStatus;
  colors: {
    primary: string;
    text: string;
    textMuted: string;
    border: string;
    borderStrong: string;
  };
  isDark: boolean;
}

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap; darkBg: string }> = {
  Delivered: { color: '#16A34A', bg: '#F0FDF4', icon: 'checkmark-circle', darkBg: '#0F2318' },
  Shipped: { color: '#2563EB', bg: '#EFF4FF', icon: 'car-outline', darkBg: '#1E2B45' },
  Processing: { color: '#D97706', bg: '#FFFBEB', icon: 'time-outline', darkBg: '#2D1F00' },
  Cancelled: { color: '#DC2626', bg: '#FEF2F2', icon: 'close-circle-outline', darkBg: '#2D0A0A' },
};

export { STATUS_CONFIG };

export default function FlowStatusBadge({ status, colors, isDark }: FlowStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: isDark ? cfg.darkBg : cfg.bg,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <Ionicons name={cfg.icon} size={12} color={cfg.color} />
      <Text style={{ fontSize: 11, fontWeight: '700', color: cfg.color }}>{status}</Text>
    </View>
  );
}

