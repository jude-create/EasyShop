import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useWishlist } from '../../context/WishlistContext';
import { useReviews } from '../../context/ReviewContext';

// Orders count is static for now (matches ORDERS array length in order-history)
const TOTAL_ORDERS = 5;

interface StatsStripProps {
  colors: {
    card: string;
    border: string;
    primary: string;
    textMuted: string;
  };
  isDark: boolean;
  // items prop kept for API compatibility but live data overrides values
  items?: { label: string; value: string }[];
}

export default function StatsStrip({ colors, isDark }: StatsStripProps) {
  const router = useRouter();
  const { totalWishlistItems } = useWishlist();
  const { totalReviews } = useReviews();

  const stats = [
    { label: 'Orders',   value: TOTAL_ORDERS.toString(),     route:'/(tabs)/profile'  },
    { label: 'Wishlist', value: totalWishlistItems.toString(),  route: '/(tabs)/wishlist' },
    { label: 'Reviews',  value: totalReviews.toString(),        route: '/reviews' },
  ];

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: -16,
        backgroundColor: colors.card,
        borderRadius: 16,
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 8,
        elevation: 3,
        overflow: 'hidden',
      }}
    >
      {stats.map((stat, index) => (
        <TouchableOpacity
          key={stat.label}
          onPress={() => router.push(stat.route as any)}
          activeOpacity={0.7}
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 16,
            borderRightWidth: index < stats.length - 1 ? 0.5 : 0,
            borderRightColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.primary, letterSpacing: -0.5 }}>
            {stat.value}
          </Text>
          <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2, fontWeight: '500' }}>
            {stat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}