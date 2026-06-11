import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import ProductTile from './ProductTile';
import TabSectionTitle from './TabSectionTitle';
import InfoBanner from './InfoBanner';
import AsyncStateCard from './AsyncStateCard';
import type { Product } from '../../constants/products';
import type { AppColors } from '../../context/ThemeContext';

interface FeaturedProductsRailProps {
  colors: AppColors;
  isDark: boolean;
  products: Product[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  wishlisted: (id: number) => boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onRetry: () => void;
}

export default function FeaturedProductsRail({
  colors,
  isDark,
  products,
  loading,
  refreshing,
  error,
  wishlisted,
  onToggleWishlist,
  onAddToCart,
  onRetry,
}: FeaturedProductsRailProps) {
  const router = useRouter();

  return (
    <>
      <View style={{ marginHorizontal: 16, marginTop: 24 }}>
        <TabSectionTitle colors={colors} title="Featured picks" actionLabel="See all" onActionPress={() => router.push('/(tabs)/products')} />
      </View>

      {loading && products.length === 0 ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <AsyncStateCard
            colors={colors}
            tone="loading"
            title="Loading featured products"
            description="Fetching live items from Strapi."
          />
        </View>
      ) : (
        <>
          {error && products.length === 0 ? (
            <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
              <AsyncStateCard
                colors={colors}
                tone="error"
                title="Couldn't load featured products"
                description={error}
                actionLabel="Try Again"
                onActionPress={onRetry}
              />
            </View>
          ) : (
            error && <InfoBanner colors={colors} tone="error" text={error} />
          )}

          {refreshing && products.length > 0 && <InfoBanner colors={colors} tone="info" text="Refreshing featured products..." />}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4 }}
          >
            {products.map((product) => (
              <ProductTile
                key={product.id}
                product={product}
                colors={colors}
                isDark={isDark}
                wishlisted={wishlisted(product.id)}
                layout="featured"
                onPress={() =>
                  router.push({
                    pathname: '/product/[id]',
                    params: { id: product.id, product: JSON.stringify(product) },
                  })
                }
                onToggleWishlist={() => onToggleWishlist(product)}
                onAddToCart={() => onAddToCart(product)}
              />
            ))}
          </ScrollView>
        </>
      )}
    </>
  );
}
