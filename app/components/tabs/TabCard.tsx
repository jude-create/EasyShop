import { ReactNode } from 'react';
import { View } from 'react-native';

interface TabCardProps {
  colors: {
    card: string;
    border: string;
  };
  children: ReactNode;
  padding?: number;
}

export default function TabCard({ colors, children, padding = 14 }: TabCardProps) {
  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 14,
        padding,
        borderWidth: 0.5,
        borderColor: colors.border,
      }}
    >
      {children}
    </View>
  );
}

