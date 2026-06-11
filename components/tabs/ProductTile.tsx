import { Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Product } from '../../constants/products';
import { getProductBadgeColors } from './productBadge';
import type { AppColors } from '../../context/ThemeContext';

interface ProductTileProps {
  product: Product;
  colors: AppColors;
  isDark: boolean;
  wishlisted: boolean;
  layout?: 'grid' | 'featured';
  onPress: () => void;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
}

export default function ProductTile({
  product,
  colors,
  isDark,
  wishlisted,
  layout = 'grid',
  onPress,
  onToggleWishlist,
  onAddToCart,
}: ProductTileProps) {
  const isFeaturedLayout = layout === 'featured';

  return (
    <View style={isFeaturedLayout ? { width: 272, marginRight: 12 } : { width: '50%', padding: 4 }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={{
          backgroundColor: colors.card,
          borderRadius: isFeaturedLayout ? 24 : 18,
          padding: isFeaturedLayout ? 14 : 12,
          borderWidth: 1,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: isDark ? 0.24 : 0.08,
          shadowRadius: 16,
          elevation: 4,
          overflow: 'hidden',
          minHeight: isFeaturedLayout ? 330 : 0,
        }}
      >
        {product.badge && (
          <View
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: getProductBadgeColors(product.badge).backgroundColor,
              borderRadius: 999,
              paddingHorizontal: 9,
              paddingVertical: 4,
              zIndex: 1,
            }}
          >
            <Text
              style={{
                color: getProductBadgeColors(product.badge).textColor,
                fontSize: 10,
                fontWeight: '700',
                letterSpacing: 0.2,
              }}
            >
              {product.badge}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={onToggleWishlist}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
            width: 34,
            height: 34,
            borderRadius: 12,
            backgroundColor: wishlisted ? 'rgba(236,72,153,0.14)' : colors.subtle,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={16}
            color={wishlisted ? '#EC4899' : colors.textMuted}
          />
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: isDark ? colors.subtle : colors.primaryLight,
            borderRadius: isFeaturedLayout ? 18 : 14,
            height: isFeaturedLayout ? 180 : 96,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            overflow: 'hidden',
          }}
        >
          <Image
            source={typeof product.image === 'string' ? { uri: product.image } : product.image}
            style={{ width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{
            fontSize: isFeaturedLayout ? 14 : 12,
            fontWeight: '700',
            color: colors.text,
            marginBottom: 4,
            letterSpacing: -0.2,
          }}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <View
            style={{
              backgroundColor: colors.subtle,
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: '600' }}>
              {product.category}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontSize: isFeaturedLayout ? 16 : 13, fontWeight: '800', color: colors.primary }}>
            {product.price}
          </Text>
          {isFeaturedLayout && (
            <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: '600' }}>Curated pick</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={onAddToCart}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 14,
            paddingVertical: isFeaturedLayout ? 11 : 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={16} color="white" />
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>Add to Cart</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
