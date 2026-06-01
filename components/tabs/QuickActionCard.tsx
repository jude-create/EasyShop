import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface QuickActionCardProps {
  colors: {
    card: string;
    border: string;
    primary: string;
    primaryLight: string;
    green: string;
    greenLight: string;
    text: string;
  };
  isDark: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconBg: string;
  iconColor: string;
  label: string;
  onPress?: () => void;
}

export default function QuickActionCard({
  colors,
  isDark,
  icon,
  iconBg,
  iconColor,
  label,
  onPress,
}: QuickActionCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 0.5,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          backgroundColor: iconBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{label}</Text>
    </TouchableOpacity>
  );
}

