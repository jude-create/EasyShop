import { Text, View } from 'react-native';

interface ReviewSummaryRowProps {
  colors: {
    text: string;
    textSecondary: string;
    primary: string;
    green: string;
  };
  label: string;
  value: string;
  emphasize?: boolean;
  valueColor?: string;
}

export default function ReviewSummaryRow({
  colors,
  label,
  value,
  emphasize = false,
  valueColor,
}: ReviewSummaryRowProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text
        style={{
          fontSize: emphasize ? 15 : 13,
          fontWeight: emphasize ? '700' : '400',
          color: colors.textSecondary,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: emphasize ? 16 : 13,
          fontWeight: emphasize ? '800' : '500',
          color: valueColor || colors.text,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

