import { View, Text, ScrollView, TouchableOpacity, Platform, ToastAndroid, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { useWishlist } from '../../context/WishlistContext';
import { Product } from '../../constants/products';

export default function ProductDetailScreen() {
  const { product: raw } = useLocalSearchParams<{ product: string }>();
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { colors } = useTheme();

  const product: Product = raw ? JSON.parse(raw) : {} as Product;
  const cartItem = cart.find((i) => i.id === product.id);
  const wishlisted = isWishlisted(product.id);

  const handleAdd = () => {
    addToCart(product);
    if (Platform.OS === 'android') {
      ToastAndroid.show(`${product.name} added to cart`, ToastAndroid.SHORT);
    } else {
      Alert.alert('Added!', `${product.name} added to cart`, [{ text: 'OK' }]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      {/* Back bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, letterSpacing: -0.2, flex: 1, textAlign: 'center', marginHorizontal: 8 }} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* Wishlist */}
          <TouchableOpacity
            onPress={() => toggleWishlist(product)}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: wishlisted ? 'rgba(236,72,153,0.12)' : colors.subtle, alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.8}
          >
            <Ionicons name={wishlisted ? 'heart' : 'heart-outline'} size={18} color={wishlisted ? '#EC4899' : colors.textMuted} />
          </TouchableOpacity>
          {/* Cart */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/cart')}
            style={{ position: 'relative' }}
          >
            <Ionicons name="bag-outline" size={22} color={colors.text} />
            {(cartItem?.quantity ?? 0) > 0 && (
              <View style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'white', fontSize: 9, fontWeight: '700' }}>{cartItem?.quantity}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Hero */}
        <View style={{ backgroundColor: colors.subtle, margin: 16, borderRadius: 20, height: 220, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <Image
            source={product.image}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
          {product.badge && (
            <View style={{ position: 'absolute', top: 14, right: 14, backgroundColor: product.badge === 'Hot' ? '#EF4444' : colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
              <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>{product.badge}</Text>
            </View>
          )}
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {/* Category */}
          <View style={{ backgroundColor: colors.primaryLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 10 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.primary }}>{product.category}</Text>
          </View>

          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.5, marginBottom: 6 }}>{product.name}</Text>
          <Text style={{ fontSize: 26, fontWeight: '800', color: colors.primary, letterSpacing: -0.5, marginBottom: 16 }}>{product.price}</Text>

          {/* Description */}
          <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 16, borderWidth: 0.5, borderColor: colors.border, marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 }}>About this product</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{product.description}</Text>
          </View>

          {/* Specs */}
          <View style={{ backgroundColor: colors.card, borderRadius: 14, padding: 16, borderWidth: 0.5, borderColor: colors.border, marginBottom: 14 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Details</Text>
            {[
              ['Brand',    product.name?.split(' ')[0] || 'N/A'],
              ['Category', product.category],
              ['Status',   'In Stock'],
              ['Warranty', '1 Year'],
            ].map(([k, v]) => (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: colors.border }}>
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>{k}</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{v}</Text>
              </View>
            ))}
          </View>

          {/* In-cart notice */}
          {cartItem && (
            <View style={{ backgroundColor: colors.greenLight, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <Ionicons name="checkmark-circle" size={18} color={colors.green} />
              <Text style={{ fontSize: 13, color: colors.green, fontWeight: '500' }}>
                {cartItem.quantity} in cart
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, paddingBottom: 28, backgroundColor: colors.card, borderTopWidth: 0.5, borderTopColor: colors.border, flexDirection: 'row', gap: 10 }}>
       
        <TouchableOpacity
          onPress={handleAdd}
          style={{ flex: 1, backgroundColor: colors.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center', height: 50 }}
          activeOpacity={0.85}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
