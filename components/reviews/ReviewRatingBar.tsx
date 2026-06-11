import { Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ReviewRatingBarProps {
  label: string;
  count: number;
  total: number;
  colors: {
    textSecondary: string;
    textMuted: string;
    subtle: string;
  };
}

export default function ReviewRatingBar({ label, count, total, colors }: ReviewRatingBarProps) {
  const pct = total > 0 ? count / total : 0;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <Text style={{ fontSize: 12, color: colors.textSecondary, width: 14, textAlign: 'right' }}>
        {label}
      </Text>
      <Ionicons name="star" size={11} color="#F59E0B" />
      <View
        style={{
          flex: 1,
          height: 6,
          backgroundColor: colors.subtle,
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            width: `${pct * 100}%`,
            height: 6,
            backgroundColor: '#F59E0B',
            borderRadius: 3,
          }}
        />
      </View>
      <Text style={{ fontSize: 11, color: colors.textMuted, width: 18, textAlign: 'right' }}>
        {count}
      </Text>
    </View>
  );
}
