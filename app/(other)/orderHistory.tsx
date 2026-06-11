import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useOrderHistory } from '../../context/OrderHistoryContext';
import { Order, OrderStatus } from '../../types/order';
import OrderModal from '../../components/OrderModal';
import FlowScreenHeader from '../../components/flow/FlowScreenHeader';
import FlowStatsStrip from '../../components/flow/FlowStatsStrip';
import FlowFilterChips from '../../components/flow/FlowFilterChips';
import FlowOrderCard from '../../components/flow/FlowOrderCard';
import TabEmptyState from '../../components/tabs/TabEmptyState';
import AsyncStateCard from '../../components/tabs/AsyncStateCard';

const FILTERS: (OrderStatus | 'All')[] = ['All', 'Delivered', 'Shipped', 'Processing', 'Cancelled'];
const FILTER_ICONS: Partial<Record<OrderStatus, keyof typeof Ionicons.glyphMap>> = {
  Delivered: 'checkmark-circle',
  Shipped: 'car-outline',
  Processing: 'time-outline',
  Cancelled: 'close-circle-outline',
};

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { orders, loading } = useOrderHistory();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = useMemo(
    () => (activeFilter === 'All' ? orders : orders.filter((order) => order.status === activeFilter)),
    [activeFilter, orders],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 20 }}>
      <FlowScreenHeader
        colors={colors}
        title="Order History"
        subtitle={`${orders.length} orders total`}
        onBack={() => router.back()}
      />

      <FlowStatsStrip
        colors={colors}
        stats={[
          { label: 'Total Orders', value: orders.length.toString() },
          { label: 'Delivered', value: orders.filter((order) => order.status === 'Delivered').length.toString() },
          {
            label: 'Total Spent',
            value:
              '₦' +
              (
                orders.filter((order) => order.status !== 'Cancelled').reduce(
                  (sum, order) => sum + order.subtotal + order.delivery,
                  0,
                ) / 1000
              ).toFixed(0) +
              'k',
          },
        ]}
      />

      <FlowFilterChips
        colors={colors}
        chips={FILTERS.map((filter) => ({
          key: filter,
          label: filter,
          icon: filter === 'All' ? undefined : FILTER_ICONS[filter],
        }))}
        activeKey={activeFilter}
        onSelect={(filter) => setActiveFilter(filter as OrderStatus | 'All')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
        {loading ? (
          <AsyncStateCard
            colors={colors}
            tone="loading"
            title="Loading order history"
            description="Fetching your saved orders."
          />
        ) : filtered.length === 0 ? (
          <TabEmptyState
            colors={colors}
            icon={<Ionicons name="receipt-outline" size={42} color={colors.textMuted} />}
            title="No orders found"
            description="Try a different filter or place a new order."
            actionLabel="Show All Orders"
            onActionPress={() => setActiveFilter('All')}
          />
        ) : (
          filtered.map((order) => (
            <FlowOrderCard
              key={order.id}
              order={order}
              colors={colors}
              isDark={isDark}
              onPress={() => setSelectedOrder(order)}
            />
          ))
        )}
      </ScrollView>

      <OrderModal selectedOrder={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </View>
  );
}
