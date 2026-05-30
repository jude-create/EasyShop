import Constants from 'expo-constants';

export interface GoogleAuthConfig {
  expoClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
}

export interface GoogleAuthProfile {
  accessToken?: string;
  email?: string;
  name?: string;
  picture?: string;
}

export function getGoogleAuthConfig(): GoogleAuthConfig {
  const extra = Constants.expoConfig?.extra as {
    googleAuth?: GoogleAuthConfig;
  } | undefined;

  const googleAuth = extra?.googleAuth ?? {};

  return {
    expoClientId: process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID ?? googleAuth.expoClientId,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? googleAuth.iosClientId,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? googleAuth.androidClientId,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? googleAuth.webClientId,
  };
}

export function hasGoogleAuthConfig(config: GoogleAuthConfig) {
  return Boolean(
    config.expoClientId ||
      config.iosClientId ||
      config.androidClientId ||
      config.webClientId,
  );
}
