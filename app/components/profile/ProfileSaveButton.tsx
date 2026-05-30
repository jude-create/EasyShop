import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

interface ProfileSaveButtonProps {
  colors: {
    primary: string;
  };
  label: string;
  loading: boolean;
  onPress: () => void;
}

export default function ProfileSaveButton({
  colors,
  label,
  loading,
  onPress,
}: ProfileSaveButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={{
        backgroundColor: colors.primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
        opacity: loading ? 0.8 : 1,
      }}
      activeOpacity={0.85}
    >
      {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontWeight: '700', fontSize: 16, letterSpacing: -0.2 }}>{label}</Text>}
    </TouchableOpacity>
  );
}

