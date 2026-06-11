import { Image, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ReviewStarRow from './ReviewStarRow';
import type { Review } from '../../context/ReviewContext';

interface ReviewCardProps {
  review: Review;
  colors: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    textSecondary: string;
    subtle: string;
    green: string;
    greenLight: string;
    primary: string;
    primaryLight: string;
    danger: string;
  };
  isDark: boolean;
}

export default function ReviewCard({ review, colors, isDark }: ReviewCardProps) {
  const badgeColor =
    review.rating >= 4 ? colors.green : review.rating === 3 ? colors.primary : '#EF4444';
  const badgeBackground =
    review.rating >= 4
      ? colors.greenLight
      : review.rating === 3
        ? colors.primaryLight
        : 'rgba(239,68,68,0.08)';

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 14,
        borderWidth: 0.5,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.04,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            backgroundColor: colors.subtle,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            source={typeof review.productImage === 'string' ? { uri: review.productImage } : review.productImage}
            style={{ width: 36, height: 36, borderRadius: 9 }}
            resizeMode="contain"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
            {review.productName}
          </Text>
          <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 1 }}>
            Order {review.orderId}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <ReviewStarRow rating={review.rating} size={14} />
          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 3 }}>{review.date}</Text>
        </View>
      </View>

      <View style={{ height: 0.5, backgroundColor: colors.border, marginBottom: 10 }} />

      <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 20 }}>
        {review.comment}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          marginTop: 10,
          alignSelf: 'flex-start',
          backgroundColor: badgeBackground,
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}
      >
        <Ionicons name="star" size={11} color={badgeColor} />
        <Text style={{ fontSize: 11, fontWeight: '700', color: badgeColor }}>
          {review.rating >= 4 ? 'Positive' : review.rating === 3 ? 'Neutral' : 'Critical'}
        </Text>
      </View>
    </View>
  );
}
