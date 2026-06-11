import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AsyncStateCardProps {
  colors: {
    card: string;
    border: string;
    primary: string;
    primaryLight: string;
    danger: string;
    dangerLight: string;
    text: string;
    textSecondary: string;
  };
  tone: 'loading' | 'error';
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export default function AsyncStateCard({
  colors,
  tone,
  title,
  description,
  actionLabel,
  onActionPress,
}: AsyncStateCardProps) {
  const isLoading = tone === 'loading';

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderRadius: 18,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 20,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 14,
          backgroundColor: isLoading ? colors.primaryLight : colors.dangerLight,
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Ionicons name="alert-circle-outline" size={28} color={colors.danger} />
        )}
      </View>

      <Text
        style={{
          fontSize: 18,
          fontWeight: '800',
          color: colors.text,
          letterSpacing: -0.3,
          textAlign: 'center',
          marginBottom: 6,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 13,
          lineHeight: 19,
          color: colors.textSecondary,
          textAlign: 'center',
        }}
      >
        {description}
      </Text>

      {actionLabel && onActionPress && (
        <TouchableOpacity
          onPress={onActionPress}
          style={{
            marginTop: 18,
            backgroundColor: isLoading ? colors.primary : colors.danger,
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 18,
          }}
          activeOpacity={0.85}
        >
          <Text style={{ color: 'white', fontSize: 14, fontWeight: '700' }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
