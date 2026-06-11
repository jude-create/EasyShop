import { Alert, Platform, ScrollView, Text, TouchableOpacity, View, ToastAndroid } from 'react-native';
import { useRouter } from 'expo-router';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useTabBarScrollHandler } from '../../context/TabBarScrollContext';
import { Product, formatPrice } from '../../constants/products';
import TabShell from '../../components/tabs/TabShell';
import TabEmptyState from '../../components/tabs/TabEmptyState';
import WishlistItemCard from '../../components/tabs/WishlistItemCard';
import TabCard from '../../components/tabs/TabCard';
import PrimaryActionButton from '../../components/tabs/PrimaryActionButton';
import Ionicons from '@expo/vector-icons/Ionicons';

function showToast(msg: string) {
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('', msg, [{ text: 'OK' }]);
  }
}

export default function WishlistScreen() {
  const router = useRouter();
  const { wishlist, removeFromWishlist, totalWishlistItems } = useWishlist();
  const { addToCart, cart } = useCart();
  const { colors, isDark } = useTheme();
  const tabBarScrollHandler = useTabBarScrollHandler();

  const handleMoveToCart = (product: Product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    showToast(`${product.name} moved to cart`);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast(`${product.name} added to cart`);
  };

  const handleMoveAllToCart = () => {
    wishlist.forEach((product) => addToCart(product));
    wishlist.forEach((product) => removeFromWishlist(product.id));
    showToast('All items moved to cart');
  };

  return (
    <TabShell backgroundColor={colors.primary} contentBackgroundColor={colors.background}>
      <View style={{ backgroundColor: colors.primary, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 22, fontWeight: '800', color: 'white', letterSpacing: -0.5 }}>
              Wishlist
            </Text>
            {totalWishlistItems > 0 && (
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
                {totalWishlistItems} saved item{totalWishlistItems !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
          {totalWishlistItems > 1 && (
            <TouchableOpacity
              onPress={handleMoveAllToCart}
              style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 }}
              activeOpacity={0.8}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>
                Move All to Cart
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {wishlist.length === 0 ? (
        <TabEmptyState
          colors={colors}
          icon={<Ionicons name="heart-outline" size={40} color={colors.textMuted} />}
          title="No saved items yet"
          description="Tap the heart icon on any product to save it here for later"
          actionLabel="Browse Products"
          onActionPress={() => router.push('/(tabs)/products')}
        />
      ) : (
        <ScrollView {...tabBarScrollHandler} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}>
          {wishlist.map((product) => (
            <WishlistItemCard
              key={product.id}
              product={product}
              colors={colors}
              isDark={isDark}
              inCart={!!cart.find((item) => item.id === product.id)}
              onPress={() =>
                router.push({
                  pathname: '/product/[id]',
                  params: { id: product.id, product: JSON.stringify(product) },
                })
              }
              onRemove={() => removeFromWishlist(product.id)}
              onMoveToCart={() => handleMoveToCart(product)}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}

          {totalWishlistItems > 0 && (
            <View style={{ marginTop: 4 }}>
              <TabCard colors={colors} padding={14}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '500' }}>
                      Total wishlist value
                    </Text>
                    <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text, letterSpacing: -0.3, marginTop: 2 }}>
                      {formatPrice(wishlist.reduce((sum, product) => sum + product.priceValue, 0))}
                    </Text>
                  </View>
                </View>
                <View style={{ height: 12 }} />
                <PrimaryActionButton
                  label="Move All to Cart"
                  onPress={handleMoveAllToCart}
                  colors={colors}
                />
              </TabCard>
            </View>
          )}
        </ScrollView>
      )}
    </TabShell>
  );
}
