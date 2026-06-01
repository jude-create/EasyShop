import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Order, OrderStatus } from '../../types/order';
import OrderModal from '../../components/OrderModal';
import FlowScreenHeader from '../../components/flow/FlowScreenHeader';
import FlowStatsStrip from '../../components/flow/FlowStatsStrip';
import FlowFilterChips from '../../components/flow/FlowFilterChips';
import FlowOrderCard from '../../components/flow/FlowOrderCard';

const ORDERS: Order[] = [
  {
    id: 'CWR-482910',
    date: 'May 24, 2026',
    status: 'Delivered',
    items: [
      { image: require('../../assets/images/samsung.jpg'), name: 'Samsung Galaxy S23', qty: 1, price: 450000 },
      { image: require('../../assets/images/headphone.jpg'), name: 'Sony WH-1000XM4', qty: 1, price: 180000 },
    ],
    subtotal: 630000,
    delivery: 0,
    paymentMethod: 'Visa •••• 4242',
    address: '12 Adeola Odeku St, Victoria Island, Lagos',
  },
  {
    id: 'CWR-371845',
    date: 'May 18, 2026',
    status: 'Shipped',
    items: [{ image: require('../../assets/images/laptop.jpg'), name: 'Dell XPS 13 Laptop', qty: 1, price: 750000 }],
    subtotal: 750000,
    delivery: 0,
    paymentMethod: 'Bank Transfer',
    address: '5 Broad Street, Lagos Island, Lagos',
  },
  {
    id: 'CWR-290374',
    date: 'May 10, 2026',
    status: 'Processing',
    items: [
      { image: require('../../assets/images/watch.jpg'), name: 'Apple Watch Series 9', qty: 1, price: 250000 },
      { image: require('../../assets/images/footwear.jpg'), name: 'Nike Air Max 270', qty: 2, price: 65000 },
    ],
    subtotal: 380000,
    delivery: 5000,
    paymentMethod: 'Mastercard •••• 5353',
    address: '12 Adeola Odeku St, Victoria Island, Lagos',
  },
  {
    id: 'CWR-183920',
    date: 'Apr 28, 2026',
    status: 'Delivered',
    items: [{ image: require('../../assets/images/pad.jpg'), name: 'PlayStation 5', qty: 1, price: 420000 }],
    subtotal: 420000,
    delivery: 0,
    paymentMethod: 'Pay on Delivery',
    address: '12 Adeola Odeku St, Victoria Island, Lagos',
  },
  {
    id: 'CWR-094821',
    date: 'Apr 15, 2026',
    status: 'Cancelled',
    items: [{ image: require('../../assets/images/TV.jpg'), name: 'LG OLED 55" C3', qty: 1, price: 950000 }],
    subtotal: 950000,
    delivery: 0,
    paymentMethod: 'Visa •••• 4242',
    address: '5 Broad Street, Lagos Island, Lagos',
  },
];

const FILTERS: (OrderStatus | 'All')[] = ['All', 'Delivered', 'Shipped', 'Processing', 'Cancelled'];

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState<OrderStatus | 'All'>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = activeFilter === 'All' ? ORDERS : ORDERS.filter((order) => order.status === activeFilter);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: 20 }}>
      <FlowScreenHeader
        colors={colors}
        title="Order History"
        subtitle={`${ORDERS.length} orders total`}
        onBack={() => router.back()}
      />

      <FlowStatsStrip
        colors={colors}
        stats={[
          { label: 'Total Orders', value: ORDERS.length.toString() },
          { label: 'Delivered', value: ORDERS.filter((order) => order.status === 'Delivered').length.toString() },
          {
            label: 'Total Spent',
            value:
              '₦' +
              (
                ORDERS.filter((order) => order.status !== 'Cancelled').reduce(
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
          icon: filter === 'All' ? undefined : { Delivered: 'checkmark-circle', Shipped: 'car-outline', Processing: 'time-outline', Cancelled: 'close-circle-outline' }[filter],
        }))}
        activeKey={activeFilter}
        onSelect={(filter) => setActiveFilter(filter as OrderStatus | 'All')}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.textSecondary, marginTop: 12 }}>
              No orders found
            </Text>
            <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
              Try a different filter
            </Text>
          </View>
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
