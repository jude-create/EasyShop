import { RefreshControl, ScrollView, View } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useOrderHistory } from '../../context/OrderHistoryContext';
import { useProfile } from '../../context/ProfileContext';
import { PRODUCTS } from '../../constants/products';
import { fetchStrapiProducts } from '../../lib/strapi';
import { useTabBarScrollHandler } from '../../context/TabBarScrollContext';
import TabShell from '../../components/tabs/TabShell';
import HomeHero from '../../components/tabs/HomeHero';
import LatestOrderCard from '../../components/tabs/LatestOrderCard';
import FeaturedProductsRail from '../../components/tabs/FeaturedProductsRail';

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { addToCart, totalItems } = useCart();
  const { toggleWishlist, isWishlisted, totalWishlistItems } = useWishlist();
  const { orders, loading: ordersLoading } = useOrderHistory();
  const { authLoading } = useProfile();
  const [featured, setFeatured] = useState<typeof PRODUCTS>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [featuredError, setFeaturedError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const tabBarScrollHandler = useTabBarScrollHandler();

  const loadFeatured = useCallback(async (fromRefresh = false) => {
    if (authLoading) return;

    if (fromRefresh) setRefreshing(true);
    else setLoadingFeatured(true);

    try {
      const remoteProducts = await fetchStrapiProducts();
      if (!mountedRef.current) return;

      if (remoteProducts.length > 0) {
        const featuredProducts = remoteProducts.filter((product) => product.isFeatured);
        setFeatured((featuredProducts.length > 0 ? featuredProducts : remoteProducts).slice(0, 4));
      } else {
        setFeatured((current) => (current.length > 0 ? current : PRODUCTS.slice(0, 4)));
      }
      setFeaturedError(null);
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to load featured products', error);
      }
      if (!mountedRef.current) return;
      setFeatured((current) => (current.length > 0 ? current : PRODUCTS.slice(0, 4)));
      setFeaturedError('Showing sample featured products.');
    } finally {
      if (!mountedRef.current) return;
      if (fromRefresh) setRefreshing(false);
      else setLoadingFeatured(false);
    }
  }, [authLoading]);

  useEffect(() => {
    if (authLoading) return;

    loadFeatured();
    return () => {
      mountedRef.current = false;
    };
  }, [authLoading, loadFeatured]);

  const heroStats = useMemo(
    () => [
      { label: 'Featured', value: String(featured.length || 4) },
      { label: 'Cart Items', value: String(totalItems) },
      { label: 'Wishlist', value: String(totalWishlistItems) },
      { label: 'Orders', value: String(orders.length) },
    ],
    [featured.length, orders.length, totalItems, totalWishlistItems],
  );

  return (
    <TabShell backgroundColor={colors.primary} contentBackgroundColor={colors.background}>
      <ScrollView
        {...tabBarScrollHandler}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadFeatured(true)} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Hero: keep this focused on discovery and one strong primary action. */}
        <HomeHero colors={colors} heroStats={heroStats} onBrowsePress={() => router.push('/(tabs)/products')} />

        {/* Surface the user's most recent order so the home screen feels like a dashboard. */}
        <LatestOrderCard
          colors={colors}
          isDark={isDark}
          order={orders[0]}
          loading={ordersLoading}
          onViewOrders={() => router.push('/(other)/orderHistory')}
          onKeepShopping={() => router.push('/(tabs)/products')}
        />

        {/* Live featured products from Strapi, with local fallback while offline. */}
        <View style={{ marginTop: 24 }}>
          <FeaturedProductsRail
            colors={colors}
            isDark={isDark}
            products={featured}
            loading={loadingFeatured}
            refreshing={refreshing}
            error={featuredError}
            wishlisted={isWishlisted}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            onRetry={loadFeatured}
          />
        </View>
      </ScrollView>
    </TabShell>
  );
}
