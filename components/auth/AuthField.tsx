import { Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AuthFieldProps extends TextInputProps {
  colors: {
    card: string;
    danger: string;
    green: string;
    text: string;
    textMuted: string;
    textSecondary: string;
    borderStrong: string;
    primary: string;
  };
  label: string;
  value: string;
  error?: string;
  icon: keyof typeof Ionicons.glyphMap;
  required?: boolean;
  showSuccess?: boolean;
  secureTextEntry?: boolean;
  showSecureToggle?: boolean;
  onToggleSecure?: () => void;
  fieldIsFocused?: boolean;
}

export default function AuthField({
  colors,
  label,
  value,
  error,
  icon,
  required = true,
  showSuccess = false,
  secureTextEntry,
  showSecureToggle = false,
  onToggleSecure,
  fieldIsFocused = false,
  ...props
}: AuthFieldProps) {
  const borderColor = error
    ? colors.danger
    : fieldIsFocused
      ? colors.primary
      : colors.borderStrong;

  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: colors.textSecondary,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {label}
        {required && <Text style={{ color: colors.danger }}> *</Text>}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.card,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor,
          paddingHorizontal: 14,
        }}
      >
        <Ionicons
          name={icon}
          size={18}
          color={error ? colors.danger : colors.textMuted}
        />
        <TextInput
          value={value}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={colors.textMuted}
          style={{
            flex: 1,
            paddingVertical: 14,
            paddingLeft: 10,
            fontSize: 15,
            color: colors.text,
          }}
          {...props}
        />

        {showSecureToggle && onToggleSecure && (
          <TouchableOpacity onPress={onToggleSecure} style={{ marginRight: 4 }}>
            <Ionicons
              name={secureTextEntry ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}

        {showSuccess && !error && value.length > 0 && (
          <Ionicons name="checkmark-circle" size={18} color={colors.green} />
        )}
      </View>

      {error ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}>
          <Ionicons name="alert-circle-outline" size={13} color={colors.danger} />
          <Text style={{ fontSize: 12, color: colors.danger, flex: 1 }}>{error}</Text>
        </View>
      ) : (
        <View style={{ marginTop: 5 }} />
      )}
    </View>
  );
}

