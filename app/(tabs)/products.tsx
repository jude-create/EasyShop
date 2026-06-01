import { ScrollView, Text, View, Alert, Platform, ToastAndroid } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';
import { PRODUCTS, CATEGORIES } from '../../constants/products';
import TabShell from '../../components/tabs/TabShell';
import SearchHeader from '../../components/tabs/SearchHeader';
import CategoryChips from '../../components/tabs/CategoryChips';
import TabEmptyState from '../../components/tabs/TabEmptyState';
import ProductTile from '../../components/tabs/ProductTile';
import Ionicons from '@expo/vector-icons/Ionicons';

function showToast(msg: string) {
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

  const filtered = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const query = search.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

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
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />

      <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 4 }}>
        <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '500' }}>
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 24 }}>
        {filtered.length === 0 ? (
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
      </ScrollView>
    </TabShell>
  );
}
