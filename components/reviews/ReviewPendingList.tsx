import { Image, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReviewableProduct } from './reviewTypes';

interface ReviewPendingListProps {
  colors: {
    card: string;
    primary: string;
    primaryLight: string;
    subtle: string;
    text: string;
    textMuted: string;
  };
  products: ReviewableProduct[];
  onPickProduct: (product: ReviewableProduct) => void;
}

export default function ReviewPendingList({ colors, products, onPickProduct }: ReviewPendingListProps) {
  if (products.length === 0) return null;

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 10 }}>
        Pending Reviews ({products.length})
      </Text>
      <View style={{ gap: 8 }}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.productId}
            onPress={() => onPickProduct(product)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.card,
              borderRadius: 14,
              padding: 12,
              gap: 12,
              borderWidth: 1,
              borderColor: colors.primary,
              borderStyle: 'dashed',
            }}
            activeOpacity={0.85}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: colors.subtle,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image source={product.productImage} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>
                {product.productName}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
                Order {product.orderId}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: colors.primaryLight,
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 5,
              }}
            >
              <Ionicons name="star-outline" size={12} color={colors.primary} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>Review</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
