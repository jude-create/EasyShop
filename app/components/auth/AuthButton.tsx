import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface AuthButtonProps {
  label: string;
  loading?: boolean;
  onPress: () => void;
  primaryColor: string;
}

export default function AuthButton({
  label,
  loading = false,
  onPress,
  primaryColor,
}: AuthButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      style={{
        backgroundColor: primaryColor,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
        opacity: loading ? 0.8 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

