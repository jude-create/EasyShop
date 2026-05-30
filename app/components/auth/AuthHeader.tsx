import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AuthHeaderProps {
  colors: {
    primary: string;
  };
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  align?: 'center' | 'left';
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function AuthHeader({
  colors,
  title,
  subtitle,
  icon,
  align = 'center',
  showBackButton = false,
  onBack,
}: AuthHeaderProps) {
  return (
    <View
      style={{
        backgroundColor: colors.primary,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 36,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        alignItems: align === 'center' ? 'center' : 'flex-start',
      }}
    >
      {showBackButton && onBack && (
        <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      )}

      <View
        style={{
          width: align === 'center' ? 72 : 56,
          height: align === 'center' ? 72 : 56,
          borderRadius: align === 'center' ? 20 : 16,
          backgroundColor: 'rgba(255,255,255,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        <Ionicons name={icon} size={align === 'center' ? 38 : 28} color="white" />
      </View>

      <Text
        style={{
          fontSize: align === 'center' ? 28 : 26,
          fontWeight: '800',
          color: 'white',
          letterSpacing: -0.5,
          textAlign: align,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.75)',
          marginTop: 4,
          textAlign: align,
        }}
      >
        {subtitle}
      </Text>
    </View>
  );
}

