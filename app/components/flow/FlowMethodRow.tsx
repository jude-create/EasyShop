import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FlowMethodRowProps {
  colors: {
    card: string;
    border: string;
    subtle: string;
    text: string;
    textMuted: string;
    textSecondary: string;
  };
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  onPress?: () => void;
}

export default function FlowMethodRow({
  colors,
  icon,
  label,
  description,
  onPress,
}: FlowMethodRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: colors.card,
        borderRadius: 14,
        padding: 14,
        borderWidth: 0.5,
        borderColor: colors.border,
        marginBottom: 8,
      }}
    >
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
        <Ionicons name={icon} size={20} color={colors.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{label}</Text>
        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 1 }}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

