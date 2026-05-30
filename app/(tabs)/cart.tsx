import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { formatPrice } from '../constants/products';
import TabShell from '../components/tabs/TabShell';
import TabEmptyState from '../components/tabs/TabEmptyState';
import TabCard from '../components/tabs/TabCard';
import InfoBanner from '../components/tabs/InfoBanner';
import CartItemRow from '../components/tabs/CartItemRow';
import PrimaryActionButton from '../components/tabs/PrimaryActionButton';

export default function CartScreen() {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const DELIVERY_THRESHOLD = 500000;
  const deliveryFee = totalPrice >= DELIVERY_THRESHOLD ? 0 : 5000;
  const grandTotal = totalPrice + deliveryFee;

  const changeQuantity = (id: number, delta: number) => {
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;
    updateQuantity(id, item.quantity + delta);
  };

  return (
    <TabShell backgroundColor={colors.primary} contentBackgroundColor={colors.background}>
      <View style={{ backgroundColor: colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', letterSpacing: -0.5 }}>
            My Cart
          </Text>
          {totalItems > 0 && (
            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 }}>
              <Text style={{ color: 'white', fontSize: 13, fontWeight: '600' }}>
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
      </View>

      {cart.length === 0 ? (
        <TabEmptyState
          colors={colors}
          icon={<Ionicons name="bag-outline" size={36} color={colors.textMuted} />}
          title="Cart is empty"
          description="Looks like you haven't added anything yet. Start shopping!"
          actionLabel="Browse Products"
          onActionPress={() => router.push('/(tabs)/products')}
        />
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
            {deliveryFee > 0 ? (
              <InfoBanner
                colors={colors}
                tone="info"
                text={`Add ${formatPrice(DELIVERY_THRESHOLD - totalPrice)} more for free delivery`}
              />
            ) : (
              <InfoBanner colors={colors} tone="success" text="You've unlocked free delivery! 🎉" />
            )}

            <View style={{ marginHorizontal: 16, marginTop: 12, gap: 10 }}>
              {cart.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  colors={colors}
                  isDark={isDark}
                  onRemove={removeFromCart}
                  onDecrease={(id) => changeQuantity(id, -1)}
                  onIncrease={(id) => changeQuantity(id, 1)}
                />
              ))}
            </View>

            <View style={{ marginHorizontal: 16, marginTop: 16 }}>
              <TabCard colors={colors} padding={16}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 14, letterSpacing: -0.2 }}>
                  Order Summary
                </Text>
                <View style={{ gap: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, color: colors.textSecondary }}>Subtotal ({totalItems} items)</Text>
                    <Text style={{ fontSize: 14, color: colors.text, fontWeight: '500' }}>
                      {formatPrice(totalPrice)}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, color: colors.textSecondary }}>Delivery</Text>
                    <Text style={{ fontSize: 14, color: deliveryFee === 0 ? colors.green : colors.text, fontWeight: '500' }}>
                      {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                    </Text>
                  </View>
                  <View style={{ height: 0.5, backgroundColor: colors.border }} />
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>Total</Text>
                    <Text style={{ fontSize: 17, fontWeight: '800', color: colors.primary }}>
                      {formatPrice(grandTotal)}
                    </Text>
                  </View>
                </View>
              </TabCard>
            </View>
            <View style={{ height: 20 }} />
          </ScrollView>

          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: colors.card,
              borderTopWidth: 0.5,
              borderTopColor: colors.border,
            }}
          >
            <PrimaryActionButton
              label="Checkout"
              rightLabel={formatPrice(grandTotal)}
              onPress={() => router.push('/checkout')}
              colors={colors}
            />
          </View>
        </>
      )}
    </TabShell>
  );
}
