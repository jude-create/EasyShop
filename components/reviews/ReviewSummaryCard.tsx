import { Text, View } from 'react-native';
import ReviewRatingBar from './ReviewRatingBar';
import ReviewStarRow from './ReviewStarRow';

interface ReviewSummaryCardProps {
  colors: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    textSecondary: string;
    subtle: string;
  };
  averageRating: number;
  totalReviews: number;
  distribution: { star: number; count: number }[];
}

export default function ReviewSummaryCard({
  colors,
  averageRating,
  totalReviews,
  distribution,
}: ReviewSummaryCardProps) {
  return (
    <View
      style={{
        margin: 16,
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 0.5,
        borderColor: colors.border,
        flexDirection: 'row',
        gap: 16,
      }}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: 80 }}>
        <Text style={{ fontSize: 42, fontWeight: '800', color: colors.text, letterSpacing: -1 }}>
          {averageRating}
        </Text>
        <ReviewStarRow rating={Math.round(averageRating)} size={14} />
        <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 4 }}>
          {totalReviews} reviews
        </Text>
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        {distribution.map((item) => (
          <ReviewRatingBar
            key={item.star}
            label={item.star.toString()}
            count={item.count}
            total={totalReviews}
            colors={colors}
          />
        ))}
      </View>
    </View>
  );
}
