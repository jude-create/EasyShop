import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';
import { loginWithGoogle } from './googleAuth';

interface GoogleAuthButtonProps {
  colors: {
    card: string;
    borderStrong: string;
    text: string;
    textMuted: string;
  };
  label?: string;
  onSuccess: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export default function GoogleAuthButton({
  colors,
  label = 'Continue with Google',
  onSuccess,
  onLoadingChange,
}: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    onLoadingChange?.(true);
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (e: any) {
      Alert.alert('Google sign-in failed', e.message);
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  };

  return (
    <View style={{ marginTop: 14 }}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={loading}
        activeOpacity={0.85}
        style={{
          backgroundColor: colors.card,
          borderRadius: 14,
          borderWidth: 1,
          borderColor: colors.borderStrong,
          paddingVertical: 14,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
          opacity: loading ? 0.8 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <>
            <Image
              source={require('../../assets/images/google.png')}
              style={{ width: 18, height: 18, resizeMode: 'contain' }}
            />
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 15 }}>
              {label}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}
