import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ReviewScreenHeaderProps {
  colors: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    primary: string;
  };
  totalReviews: number;
  canWriteReview: boolean;
  onBack: () => void;
  onWriteReview: () => void;
}

export default function ReviewScreenHeader({
  colors,
  totalReviews,
  canWriteReview,
  onBack,
  onWriteReview,
}: ReviewScreenHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: colors.card,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
      }}
    >
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text, letterSpacing: -0.3 }}>
          My Reviews
        </Text>
        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 1 }}>
          {totalReviews} reviews written
        </Text>
      </View>
      {canWriteReview && (
        <TouchableOpacity
          onPress={onWriteReview}
          style={{
            backgroundColor: colors.primary,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 7,
          }}
          activeOpacity={0.85}
        >
          <Text style={{ color: 'white', fontSize: 12, fontWeight: '700' }}>+ Write Review</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
