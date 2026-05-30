import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemeMode } from '../../context/ThemeContext';

interface ThemeSwitcherProps {
  colors: {
    card: string;
    border: string;
    borderStrong: string;
    primary: string;
    primaryLight: string;
    subtle: string;
    text: string;
    textMuted: string;
  };
  themeMode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}

const THEME_OPTIONS: { mode: ThemeMode; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { mode: 'light', icon: 'sunny-outline', label: 'Light' },
  { mode: 'dark', icon: 'moon-outline', label: 'Dark' },
  { mode: 'system', icon: 'phone-portrait-outline', label: 'System' },
];

export default function ThemeSwitcher({ colors, themeMode, onChange }: ThemeSwitcherProps) {
  return (
    <View style={{ marginHorizontal: 16, marginTop: 20 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 10 }}>
        Appearance
      </Text>
      <View
        style={{
          backgroundColor: colors.card,
          borderRadius: 14,
          padding: 14,
          borderWidth: 0.5,
          borderColor: colors.border,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {THEME_OPTIONS.map(({ mode, icon, label }) => {
            const active = themeMode === mode;
            return (
              <TouchableOpacity
                key={mode}
                onPress={() => onChange(mode)}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderRadius: 10,
                  gap: 4,
                  backgroundColor: active ? colors.primaryLight : colors.subtle,
                  borderWidth: active ? 1.5 : 0.5,
                  borderColor: active ? colors.primary : colors.border,
                }}
                activeOpacity={0.8}
              >
                <Ionicons name={icon} size={18} color={active ? colors.primary : colors.textMuted} />
                <Text style={{ fontSize: 11, fontWeight: '600', color: active ? colors.primary : colors.textMuted }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

