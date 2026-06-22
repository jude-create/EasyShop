import { Alert, Platform, RefreshControl, ScrollView, Text, View, ToastAndroid } from 'react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';
import { PRODUCTS, CATEGORIES } from '../../constants/products';
import { fetchStrapiCategories, fetchStrapiProducts, type StrapiCategory } from '../../lib/strapi';
import { useTabBarScrollHandler } from '../../context/TabBarScrollContext';
import TabShell from '../../components/tabs/TabShell';
import SearchHeader from '../../components/tabs/SearchHeader';
import CategoryChips from '../../components/tabs/CategoryChips';
import TabEmptyState from '../../components/tabs/TabEmptyState';
import ProductTile from '../../components/tabs/ProductTile';
import InfoBanner from '../../components/tabs/InfoBanner';
import AsyncStateCard from '../../components/tabs/AsyncStateCard';
import ProductGridSkeleton from '../../components/tabs/ProductGridSkeleton';
import Ionicons from '@expo/vector-icons/Ionicons';

function showToast(msg: string) {
  // Keep cart feedback native to the platform so the action feels immediate.
  if (Platform.OS === 'android') {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  } else {
    Alert.alert('Added to Cart', msg, [{ text: 'OK' }]);
  }
}

export default function ProductsScreen() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { colors, isDark } = useTheme();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [products, setProducts] = useState<typeof PRODUCTS>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loadingRemote, setLoadingRemote] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [remoteError, setRemoteError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const tabBarScrollHandler = useTabBarScrollHandler();

  const loadCatalog = useCallback(async (fromRefresh = false) => {
    // Use one loader for both the initial fetch and pull-to-refresh so the UI stays consistent.
    if (fromRefresh) {
      setRefreshing(true);
    } else {
      setLoadingRemote(true);
    }

    try {
      // Products are the critical request. Categories load independently so a
      // slow category response never keeps the catalog grid empty.
      const categoriesPromise = fetchStrapiCategories().catch((error) => {
        if (__DEV__) {
          console.warn('Failed to load catalog categories', error);
        }
        return [] as StrapiCategory[];
      });
      const remoteProducts = await fetchStrapiProducts();

      if (!mountedRef.current) return;

      if (remoteProducts.length > 0) {
        setProducts(remoteProducts);
      } else {
        setProducts((current) => (current.length > 0 ? current : PRODUCTS));
      }

      setRemoteError(null);
      setLoadingRemote(false);

      const remoteCategories = await categoriesPromise;
      if (!mountedRef.current) return;

      const nextCategories = new Set<string>(['All', ...CATEGORIES]);
      remoteCategories.forEach((category: StrapiCategory) => nextCategories.add(category.name));
      remoteProducts.forEach((product) => nextCategories.add(product.category));
      setCategories(Array.from(nextCategories));
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to load catalog', error);
      }
      if (!mountedRef.current) return;
      setProducts((current) => (current.length > 0 ? current : PRODUCTS));
      setCategories((current) => (current.length > 1 ? current : CATEGORIES));
      setRemoteError('Showing sample products.');
    } finally {
      if (!mountedRef.current) return;
      if (fromRefresh) {
        setRefreshing(false);
      } else {
        setLoadingRemote(false);
      }
    }
  }, []);

  useEffect(() => {
    // Load the catalog once on mount and guard against state updates after unmount.
    loadCatalog();

    return () => {
      mountedRef.current = false;
    };
  }, [loadCatalog]);

  const filtered = useMemo(() => {
    // Combine search and category filtering in one memo so rendering stays cheap.
    return products.filter((product) => {
      const query = search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, products]);

  return (
    <TabShell backgroundColor={colors.primary} contentBackgroundColor={colors.background}>
      <SearchHeader
        colors={colors}
        title="Products"
        value={search}
        onChangeText={setSearch}
        onClear={() => setSearch('')}
      />

      <CategoryChips
        colors={colors}
        categories={categories}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <ScrollView
        {...tabBarScrollHandler}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadCatalog(true)} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 82}}
      >
        {loadingRemote && products.length === 0 ? (
          <View style={{ paddingTop: 8 }}>
            <ProductGridSkeleton colors={colors} isDark={isDark} />
          </View>
        ) : (
          <>
            {remoteError && products.length === 0 ? (
              // If Strapi is unavailable and there is no cached data, present the full error card.
              <View style={{ marginTop: 12 }}>
                <AsyncStateCard
                  colors={colors}
                  tone="error"
                  title="Couldn't load the catalog"
                  description={remoteError}
                  actionLabel="Try Again"
                  onActionPress={loadCatalog}
                />
              </View>
            ) : (
              remoteError && (
                // If we still have products, downgrade the error to a banner instead of blocking the screen.
                <InfoBanner colors={colors} tone="error" text={remoteError} />
              )
            )}

            {refreshing && products.length > 0 && (
              // Keep the UI responsive during refresh without hiding the visible catalog.
              <InfoBanner colors={colors} tone="info" text="Refreshing live catalog..." />
            )}

            <View style={{ paddingHorizontal: 4, paddingTop: 4, paddingBottom: 4 }}>
              <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '500' }}>
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
              </Text>
            </View>

            {filtered.length === 0 ? (
              // Empty state only appears after the user has narrowed the catalog to zero results.
              <TabEmptyState
                colors={colors}
                icon={<Ionicons name="search-outline" size={48} color={colors.textMuted} />}
                title="No products found"
                description="Try a different search or category"
                actionLabel="Clear Search"
                onActionPress={() => {
                  setSearch('');
                  setActiveCategory('All');
                }}
              />
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {filtered.map((product) => (
                  <ProductTile
                    key={product.id}
                    product={product}
                    colors={colors}
                    isDark={isDark}
                    wishlisted={isWishlisted(product.id)}
                    onPress={() =>
                      router.push({
                        pathname: '/product/[id]',
                        params: { id: product.id, product: JSON.stringify(product) },
                      })
                    }
                    onToggleWishlist={() => toggleWishlist(product)}
                    onAddToCart={() => {
                      addToCart(product);
                      showToast(`${product.name} added to cart`);
                    }}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </TabShell>
  );
}
