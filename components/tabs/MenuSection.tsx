import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string | null;
  chevron?: boolean;
}

interface MenuSectionProps {
  colors: {
    card: string;
    border: string;
    subtle: string;
    text: string;
    textMuted: string;
    textSecondary: string;
  };
  title: string;
  items: MenuItem[];
  onItemPress: (route: string) => void;
}

export default function MenuSection({ colors, title, items, onItemPress }: MenuSectionProps) {
  return (
    <View style={{ marginHorizontal: 16, marginTop: 20 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>
        {title}
      </Text>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 14,
          borderWidth: 0.5,
          borderColor: colors.border,
          overflow: 'hidden',
        }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.label}
            onPress={() => item.route && onItemPress(item.route)}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 14,
              gap: 12,
              borderBottomWidth: index < items.length - 1 ? 0.5 : 0,
              borderBottomColor: colors.border,
            }}
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                backgroundColor: colors.subtle,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name={item.icon} size={18} color={colors.textSecondary} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '500', color: colors.text }}>
              {item.label}
            </Text>
            {item.chevron && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

