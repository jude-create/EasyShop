import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TabEmptyStateProps {
  colors: {
    card: string;
    subtle: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    primary: string;
    primaryLight: string;
    greenLight: string;
  };
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function TabEmptyState({
  colors,
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
}: TabEmptyStateProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 }}>
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 28,
          backgroundColor: colors.subtle,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
        }}
      >
        {icon}
      </View>
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, letterSpacing: -0.3, marginBottom: 8 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: 28 }}>
        {description}
      </Text>
      {actionLabel && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          style={{ backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 }}
          activeOpacity={0.85}
        >
          <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

