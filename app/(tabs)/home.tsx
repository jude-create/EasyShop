import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { PRODUCTS } from '../../constants/products';
import TabShell from '../../components/tabs/TabShell';
import TabSectionTitle from '../../components/tabs/TabSectionTitle';
import QuickActionCard from '../../components/tabs/QuickActionCard';
import ServiceListItem from '../../components/tabs/ServiceListItem';
import ProductTile from '../../components/tabs/ProductTile';

const SERVICES = [
  {
    icon: 'cart-outline' as const,
    title: 'Online Store',
    description: 'Browse, shop & checkout with ease',
    bg: '#EFF4FF',
    iconColor: '#2563EB',
    darkBg: '#1E2B45',
  },
  {
    icon: 'desktop-outline' as const,
    title: 'POS Terminal',
    description: 'Fast in-store point-of-sale',
    bg: '#F0FDF4',
    iconColor: '#16A34A',
    darkBg: '#0F2318',
  },
  {
    icon: 'bar-chart-outline' as const,
    title: 'Admin Dashboard',
    description: 'Inventory, sales & analytics',
    bg: '#F5F3FF',
    iconColor: '#7C3AED',
    darkBg: '#1E1830',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const featured = PRODUCTS.slice(0, 4);

  return (
    <TabShell backgroundColor={colors.primary} contentBackgroundColor={colors.background}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={{ backgroundColor: colors.primary, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 28 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <View>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' }}>
                Welcome
              </Text>
              <Text style={{ fontSize: 24, fontWeight: '800', color: 'white', letterSpacing: -0.5, marginTop: 2 }}>
                CW RETAIL
              </Text>
            </View>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="storefront" size={22} color="white" />
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginHorizontal: 16, marginTop: -16 }}>
          <QuickActionCard
            colors={colors}
            isDark={isDark}
            icon="bag-outline"
            iconBg={colors.primaryLight}
            iconColor={colors.primary}
            label="Shop Online"
            onPress={() => router.push('/(tabs)/products')}
          />
          <QuickActionCard
            colors={colors}
            isDark={isDark}
            icon="settings-outline"
            iconBg={colors.greenLight}
            iconColor={colors.green}
            label="Admin Portal"
          />
        </View>

      <View style={{  marginHorizontal: 16, marginTop: 24 }}>
        <TabSectionTitle colors={colors} title="Our Services" />
         <View style={{  gap: 10 }}>
          {SERVICES.map((service) => (
            <ServiceListItem key={service.title} colors={colors} isDark={isDark} {...service} />
          ))}
        </View>
        </View>

        <View style={{ marginHorizontal: 16, marginTop: 24 }}>
          <TabSectionTitle
            colors={colors}
            title="Featured"
            actionLabel="See all →"
            onActionPress={() => router.push('/(tabs)/products')}
          />
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 }}>
          {featured.map((product) => (
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
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </View>
      </ScrollView>
    </TabShell>
  );
}

