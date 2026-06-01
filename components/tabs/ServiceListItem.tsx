import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface ServiceListItemProps {
  colors: {
    card: string;
    border: string;
    text: string;
    textSecondary: string;
    textMuted: string;
  };
  isDark: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  bg: string;
  darkBg: string;
  iconColor: string;
}

export default function ServiceListItem({
  colors,
  isDark,
  icon,
  title,
  description,
  bg,
  darkBg,
  iconColor,
}: ServiceListItemProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 14,
        gap: 12,
        borderWidth: 0.5,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isDark ? 0.2 : 0.04,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          backgroundColor: isDark ? darkBg : bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>{description}</Text>
      </View>
      
    </TouchableOpacity>
  );
}

