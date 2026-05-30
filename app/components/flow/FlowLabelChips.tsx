import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FlowLabelChipsProps {
  colors: {
    card: string;
    subtle: string;
    primary: string;
    primaryLight: string;
    border: string;
    textMuted: string;
  };
  labels: string[];
  value: string;
  onChange: (value: string) => void;
  icons: Record<string, keyof typeof Ionicons.glyphMap>;
}

export default function FlowLabelChips({ colors, labels, value, onChange, icons }: FlowLabelChipsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
      {labels.map((label) => {
        const active = value === label;
        return (
          <TouchableOpacity
            key={label}
            onPress={() => onChange(label)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              alignItems: 'center',
              backgroundColor: active ? colors.primaryLight : colors.subtle,
              borderWidth: active ? 1.5 : 0.5,
              borderColor: active ? colors.primary : colors.border,
            }}
          >
            <Ionicons name={icons[label]} size={16} color={active ? colors.primary : colors.textMuted} />
            <Text style={{ fontSize: 11, fontWeight: '600', color: active ? colors.primary : colors.textMuted, marginTop: 3 }}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

