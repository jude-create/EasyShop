import { View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '.././context/ThemeContext';
import { formatPrice } from '.././constants/products';
import { Order, OrderStatus } from '../types/order';
import { useRouter } from 'expo-router';


 type Props = {
  selectedOrder: Order | null;
  onClose: () => void;
};

export default function OrderModal({
  selectedOrder,
  onClose,
}: Props) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  
 const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap }> = {
   Delivered:  { color: '#16A34A', bg: '#F0FDF4', icon: 'checkmark-circle' },
   Shipped:    { color: '#2563EB', bg: '#EFF4FF', icon: 'car-outline' },
   Processing: { color: '#D97706', bg: '#FFFBEB', icon: 'time-outline' },
   Cancelled:  { color: '#DC2626', bg: '#FEF2F2', icon: 'close-circle-outline' },
 };
 
 const DARK_STATUS_BG: Record<OrderStatus, string> = {
   Delivered:  '#0F2318',
   Shipped:    '#1E2B45',
   Processing: '#2D1F00',
   Cancelled:  '#2D0A0A',
 };

  return (
    <Modal
        visible={!!selectedOrder}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        {selectedOrder && (
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            {/* Modal Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={22} color={colors.text} />
              </TouchableOpacity>
              <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, letterSpacing: -0.3 }}>Order Details</Text>
              <View style={{ width: 22 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>

              {/* Status banner */}
              {(() => {
                const cfg = STATUS_CONFIG[selectedOrder.status];
                return (
                  <View style={{ backgroundColor: isDark ? DARK_STATUS_BG[selectedOrder.status] : cfg.bg, borderRadius: 14, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Ionicons name={cfg.icon} size={28} color={cfg.color} />
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: cfg.color }}>{selectedOrder.status}</Text>
                      <Text style={{ fontSize: 12, color: cfg.color, opacity: 0.8, marginTop: 2 }}>
                        {selectedOrder.status === 'Delivered'  && 'Your order has been delivered'}
                        {selectedOrder.status === 'Shipped'    && 'Your order is on the way'}
                        {selectedOrder.status === 'Processing' && 'Your order is being prepared'}
                        {selectedOrder.status === 'Cancelled'  && 'This order was cancelled'}
                      </Text>
                    </View>
                  </View>
                );
              })()}

              {/* Order meta */}
              <View style={{ backgroundColor: colors.card, borderRadius: 14, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' }}>
                {[
                  { label: 'Order ID',  value: selectedOrder.id },
                  { label: 'Date',      value: selectedOrder.date },
                  { label: 'Payment',   value: selectedOrder.paymentMethod },
                ].map((row, i, arr) => (
                  <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderBottomWidth: i < arr.length - 1 ? 0.5 : 0, borderBottomColor: colors.border }}>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>{row.label}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, flex: 1, textAlign: 'right' }} numberOfLines={1}>{row.value}</Text>
                  </View>
                ))}
              </View>

              {/* Items */}
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 10 }}>
                  Items ({selectedOrder.items.length})
                </Text>
                <View style={{ backgroundColor: colors.card, borderRadius: 14, borderWidth: 0.5, borderColor: colors.border, overflow: 'hidden' }}>
                  {selectedOrder.items.map((item, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, borderBottomWidth: i < selectedOrder.items.length - 1 ? 0.5 : 0, borderBottomColor: colors.border }}>
                      <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: colors.subtle, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                          source={typeof item.image === 'string' ? { uri: item.image } : item.image}
                          style={{ width: '100%', height: '100%' }}
                          resizeMode="contain"
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 2 }}>Qty: {item.qty} × {formatPrice(item.price)}</Text>
                      </View>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>{formatPrice(item.price * item.qty)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Delivery address */}
              <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 14, borderWidth: 0.5, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Ionicons name="location-outline" size={16} color={colors.primary} />
                  <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>Delivery Address</Text>
                </View>
                <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 19 }}>{selectedOrder.address}</Text>
              </View>

              {/* Price breakdown */}
              <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 16, borderWidth: 0.5, borderColor: colors.border }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Price Summary</Text>
                <View style={{ gap: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>Subtotal</Text>
                    <Text style={{ fontSize: 13, color: colors.text, fontWeight: '500' }}>{formatPrice(selectedOrder.subtotal)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 13, color: colors.textSecondary }}>Delivery</Text>
                    <Text style={{ fontSize: 13, color: selectedOrder.delivery === 0 ? colors.green : colors.text, fontWeight: '500' }}>
                      {selectedOrder.delivery === 0 ? 'FREE' : formatPrice(selectedOrder.delivery)}
                    </Text>
                  </View>
                  <View style={{ height: 0.5, backgroundColor: colors.border }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>Total</Text>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary }}>{formatPrice(selectedOrder.subtotal + selectedOrder.delivery)}</Text>
                  </View>
                </View>
              </View>

              {/* Reorder button (only for delivered) */}
              {selectedOrder.status === 'Delivered' && (
                <TouchableOpacity
                  onPress={() => { onClose(); router.push('/(tabs)/products'); }}
                  style={{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                  activeOpacity={0.85}
                >
                  <Ionicons name="refresh-outline" size={18} color="white" />
                  <Text style={{ color: 'white', fontWeight: '700', fontSize: 15, letterSpacing: -0.2 }}>Reorder</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
  )
}