import { Text } from 'react-native';

interface ReviewAddressLineProps {
  colors: {
    textSecondary: string;
  };
  children: string;
}

export default function ReviewAddressLine({ colors, children }: ReviewAddressLineProps) {
  return (
    <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 19 }}>
      {children}
    </Text>
  );
}

