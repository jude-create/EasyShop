import { Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Product } from '../../constants/products';
import type { AppColors } from '../../context/ThemeContext';

interface WishlistItemCardProps {
  product: Product;
  colors: AppColors;
  isDark: boolean;
  inCart: boolean;
  onPress: () => void;
  onRemove: () => void;
  onMoveToCart: () => void;
  onAddToCart: () => void;
}

export default function WishlistItemCard({
  product,
  colors,
  isDark,
  inCart,
  onPress,
  onRemove,
  onMoveToCart,
  onAddToCart,
}: WishlistItemCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: colors.border,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        <View style={{ flexDirection: 'row', padding: 12, gap: 12, alignItems: 'center' }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 14,
              backgroundColor: colors.subtle,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Image source={typeof product.image === 'string' ? { uri: product.image } : product.image} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            {product.badge && (
              <View
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  backgroundColor: product.badge === 'Hot' ? '#EF4444' : colors.primary,
                  borderRadius: 5,
                  paddingHorizontal: 5,
                  paddingVertical: 2,
                }}
              >
                <Text style={{ color: 'white', fontSize: 8, fontWeight: '700' }}>{product.badge}</Text>
              </View>
            )}
          </View>

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={{ fontSize: 10, fontWeight: '500', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 3 }}>
                  {product.category}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 19 }} numberOfLines={2}>
                  {product.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onRemove}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  backgroundColor: 'rgba(236,72,153,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="heart" size={18} color="#EC4899" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary, letterSpacing: -0.3, marginTop: 6 }}>
              {product.price}
            </Text>

            {inCart && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Ionicons name="checkmark-circle" size={12} color={colors.green} />
                <Text style={{ fontSize: 11, color: colors.green, fontWeight: '500' }}>Already in cart</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: colors.border }}>
        <TouchableOpacity
          onPress={onMoveToCart}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 5,
            borderRightWidth: 0.5,
            borderRightColor: colors.border,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="swap-horizontal-outline" size={15} color={colors.textSecondary} />
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textSecondary }}>Move to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onAddToCart}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 5,
            backgroundColor: colors.primaryLight,
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="bag-add-outline" size={15} color={colors.primary} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
