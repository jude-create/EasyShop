import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getGoogleAuthConfig, hasGoogleAuthConfig, type GoogleAuthConfig, type GoogleAuthProfile } from './googleAuth';

WebBrowser.maybeCompleteAuthSession();

interface GoogleAuthButtonProps {
  colors: {
    card: string;
    borderStrong: string;
    text: string;
    textMuted: string;
  };
  label?: string;
  onSuccess: (profile: GoogleAuthProfile) => void;
}

const REDIRECT_SCHEME = 'easyshoppos';

function getMissingConfigMessage(config: GoogleAuthConfig) {
  if (Platform.OS === 'android' && !config.androidClientId) {
    return 'Google sign-in on Android needs an androidClientId.';
  }

  if (Platform.OS === 'ios' && !config.iosClientId) {
    return 'Google sign-in on iPhone needs an iosClientId.';
  }

  if (Platform.OS === 'web' && !config.webClientId) {
    return 'Google sign-in on web needs a webClientId.';
  }

  return 'Google sign-in is not fully configured for this platform.';
}

async function fetchGoogleProfile(accessToken: string) {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Unable to read Google profile');
  }

  return (await response.json()) as GoogleAuthProfile;
}

function GoogleAuthButtonInner({
  colors,
  label = 'Continue with Google',
  onSuccess,
  config,
}: GoogleAuthButtonProps & { config: GoogleAuthConfig }) {
  const [loading, setLoading] = useState(false);
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: REDIRECT_SCHEME,
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: config.expoClientId,
    iosClientId: config.iosClientId,
    androidClientId: config.androidClientId,
    webClientId: config.webClientId,
    redirectUri,
    scopes: ['profile', 'email'],
  });

  useEffect(() => {
    if (!response) {
      return;
    }

    if (response.type === 'success') {
      const accessToken = response.authentication?.accessToken;

      if (!accessToken) {
        setLoading(false);
        Alert.alert('Google sign-in', 'Google did not return an access token.');
        return;
      }

      fetchGoogleProfile(accessToken)
        .then((profile) => {
          onSuccess({
            ...profile,
            accessToken,
          });
        })
        .catch(() => {
          onSuccess({ accessToken });
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    if (response.type === 'cancel' || response.type === 'dismiss' || response.type === 'error') {
      setLoading(false);
    }
  }, [onSuccess, response]);

  const handlePress = async () => {
    if (!request) {
      Alert.alert(
        'Google sign-in not configured',
        'Add your Google OAuth client IDs to enable this button.',
      );
      return;
    }

    setLoading(true);

    const useProxy = Platform.OS !== 'web' && Constants.appOwnership === 'expo';
    const result = await promptAsync(useProxy ? { useProxy: true } : undefined);

    if (result.type !== 'success') {
      setLoading(false);
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
            <Ionicons name="logo-google" size={18} color={colors.text} />
            <Text style={{ color: colors.text, fontWeight: '700', fontSize: 15 }}>
              {label}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function GoogleAuthButton(props: GoogleAuthButtonProps) {
  const config = getGoogleAuthConfig();
  const isConfigured = hasGoogleAuthConfig(config);

  if (!isConfigured) {
    return (
      <View style={{ marginTop: 14 }}>
        <TouchableOpacity
          disabled
          activeOpacity={0.85}
          style={{
            backgroundColor: props.colors.card,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: props.colors.borderStrong,
            paddingVertical: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            opacity: 0.7,
          }}
        >
          <Ionicons name="logo-google" size={18} color={props.colors.text} />
          <Text style={{ color: props.colors.text, fontWeight: '700', fontSize: 15 }}>
            {props.label ?? 'Continue with Google'}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: props.colors.textMuted, marginTop: 6, textAlign: 'center' }}>
          Configure Google OAuth client IDs to enable this option.
        </Text>
      </View>
    );
  }

  if (
    (Platform.OS === 'android' && !config.androidClientId) ||
    (Platform.OS === 'ios' && !config.iosClientId) ||
    (Platform.OS === 'web' && !config.webClientId)
  ) {
    return (
      <View style={{ marginTop: 14 }}>
        <TouchableOpacity
          disabled
          activeOpacity={0.85}
          style={{
            backgroundColor: props.colors.card,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: props.colors.borderStrong,
            paddingVertical: 14,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            opacity: 0.7,
          }}
        >
          <Ionicons name="logo-google" size={18} color={props.colors.text} />
          <Text style={{ color: props.colors.text, fontWeight: '700', fontSize: 15 }}>
            {props.label ?? 'Continue with Google'}
          </Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 12, color: props.colors.textMuted, marginTop: 6, textAlign: 'center' }}>
          {getMissingConfigMessage(config)}
        </Text>
      </View>
    );
  }

  return <GoogleAuthButtonInner {...props} config={config} />;
}
