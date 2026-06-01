import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FlowScreenHeaderProps {
  colors: {
    card: string;
    border: string;
    text: string;
    textMuted: string;
    primary: string;
  };
  title: string;
  subtitle?: string;
  onBack: () => void;
  onRightPress?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
}

export default function FlowScreenHeader({
  colors,
  title,
  subtitle,
  onBack,
  onRightPress,
  rightIcon = 'add-circle-outline',
}: FlowScreenHeaderProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: colors.card,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.border,
      }}
    >
      <TouchableOpacity onPress={onBack}>
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </TouchableOpacity>

      <View style={{ flex: 1, alignItems: 'center', paddingHorizontal: 12 }}>
        <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text, letterSpacing: -0.3 }}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 1 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {onRightPress ? (
        <TouchableOpacity onPress={onRightPress}>
          <Ionicons name={rightIcon} size={24} color={colors.primary} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
    </View>
  );
}

