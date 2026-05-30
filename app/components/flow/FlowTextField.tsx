import { Text, TextInput, TextInputProps, View } from 'react-native';

interface FlowTextFieldProps extends TextInputProps {
  colors: {
    card: string;
    borderStrong: string;
    text: string;
    textMuted: string;
    textSecondary: string;
  };
  label: string;
}

export default function FlowTextField({
  colors,
  label,
  ...props
}: FlowTextFieldProps) {
  return (
    <View>
      <Text
        style={{
          fontSize: 12,
          fontWeight: '600',
          color: colors.textSecondary,
          letterSpacing: 0.3,
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          paddingHorizontal: 14,
          paddingVertical: 13,
          fontSize: 15,
          color: colors.text,
        }}
        {...props}
      />
    </View>
  );
}

