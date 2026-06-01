import { Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Product } from '../../constants/products';

interface ProductTileProps {
  product: Product;
  colors: {
    card: string;
    border: string;
    subtle: string;
    primary: string;
    text: string;
    textMuted: string;
    green: string;
  };
  isDark: boolean;
  wishlisted: boolean;
  onPress: () => void;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
}

export default function ProductTile({
  product,
  colors,
  isDark,
  wishlisted,
  onPress,
  onToggleWishlist,
  onAddToCart,
}: ProductTileProps) {
  return (
    <View style={{ width: '50%', padding: 4 }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        style={{
          backgroundColor: colors.card,
          borderRadius: 14,
          padding: 12,
          borderWidth: 0.5,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0.2 : 0.05,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        {product.badge && (
          <View
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: product.badge === 'Hot' ? '#EF4444' : colors.primary,
              borderRadius: 6,
              paddingHorizontal: 7,
              paddingVertical: 2,
              zIndex: 1,
            }}
          >
            <Text style={{ color: 'white', fontSize: 9, fontWeight: '700' }}>{product.badge}</Text>
          </View>
        )}

        <TouchableOpacity
          onPress={onToggleWishlist}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            width: 30,
            height: 30,
            borderRadius: 9,
            backgroundColor: wishlisted ? 'rgba(236,72,153,0.12)' : colors.subtle,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={wishlisted ? 'heart' : 'heart-outline'}
            size={15}
            color={wishlisted ? '#EC4899' : colors.textMuted}
          />
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: colors.subtle,
            borderRadius: 10,
            height: 90,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            overflow: 'hidden',
          }}
        >
           <Image
    source={typeof product.image === 'string' ? { uri: product.image } : product.image}
    style={{ width: 800, height: '100%' }}
    resizeMode="contain"
  />
        </View>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text, marginBottom: 2 }} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={{ fontSize: 10, color: colors.textMuted, marginBottom: 6 }}>
          {product.category}
        </Text>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary, marginBottom: 8 }}>
          {product.price}
        </Text>
        <TouchableOpacity
          onPress={onAddToCart}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 8,
            paddingVertical: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 4,
          }}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={14} color="white" />
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>Add to Cart</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}
