import { ScrollView, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Chip {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface FlowFilterChipsProps {
  colors: {
    card: string;
    border: string;
    borderStrong: string;
    primary: string;
    text: string;
  };
  chips: Chip[];
  activeKey: string;
  onSelect: (key: string) => void;
}

export default function FlowFilterChips({
  colors,
  chips,
  activeKey,
  onSelect,
}: FlowFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8, alignItems: 'center' }}
      style={{ flexGrow: 0, backgroundColor: colors.card, borderBottomWidth: 0.5, borderBottomColor: colors.border }}
    >
      {chips.map((chip) => {
        const active = activeKey === chip.key;
        return (
          <TouchableOpacity
            key={chip.key}
            onPress={() => onSelect(chip.key)}
            style={{
              paddingHorizontal: 16,
              minHeight: 34,
              borderRadius: 20,
              backgroundColor: active ? colors.primary : colors.card,
              borderWidth: 1,
              borderColor: active ? colors.primary : colors.borderStrong,
              justifyContent: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            }}
            activeOpacity={0.8}
          >
            {chip.icon && <Ionicons name={chip.icon} size={15} color={active ? 'white' : colors.primary} />}
            <Text style={{ fontSize: 13, fontWeight: active ? '700' : '500', color: active ? 'white' : colors.text }}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
