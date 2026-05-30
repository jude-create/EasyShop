import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FlowOptionRowProps {
  colors: {
    card: string;
    border: string;
    borderStrong: string;
    primary: string;
    primaryLight: string;
    subtle: string;
    text: string;
    textMuted: string;
    textSecondary: string;
  };
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  selected: boolean;
  onPress: () => void;
}

export default function FlowOptionRow({
  colors,
  icon,
  label,
  description,
  selected,
  onPress,
}: FlowOptionRowProps) {
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
        borderWidth: selected ? 1.5 : 0.5,
        borderColor: selected ? colors.primary : colors.border,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          backgroundColor: selected ? colors.primaryLight : colors.subtle,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={20} color={selected ? colors.primary : colors.textSecondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text }}>{label}</Text>
        <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 1 }}>{description}</Text>
      </View>
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: selected ? colors.primary : colors.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary }} />}
      </View>
    </TouchableOpacity>
  );
}

