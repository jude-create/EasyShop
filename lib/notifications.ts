import { Platform } from 'react-native';
import Constants from 'expo-constants';

type ExpoNotificationsModule = typeof import('expo-notifications');

export interface PushRegistrationResult {
  token: string | null;
  status: string;
  reason?: string;
}

async function getNotificationsModule(): Promise<ExpoNotificationsModule | null> {
  try {
    return await import('expo-notifications');
  } catch {
    return null;
  }
}

export function configureNotifications() {
  // Intentionally left lazy so the app stays usable in runtimes where the native module is unavailable.
  void getNotificationsModule().then((Notifications) => {
    if (!Notifications) {
      if (__DEV__) {
        console.log('[notifications] expo-notifications native module is unavailable');
      }
      return;
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    if (Platform.OS === 'android') {
      void Notifications.setNotificationChannelAsync('orders', {
        name: 'Orders',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
      })
        .then(() => {
          if (__DEV__) {
            console.log('[notifications] Android orders channel configured');
          }
        })
        .catch((error) => {
          if (__DEV__) {
            console.warn('[notifications] failed to configure Android channel', error);
          }
        });
    }
  });
}

export async function registerForPushNotificationsAsync(): Promise<PushRegistrationResult> {
  if (Platform.OS === 'web') {
    return { token: null, status: 'unavailable', reason: 'web' };
  }

  const Notifications = await getNotificationsModule();
  if (!Notifications) {
    return { token: null, status: 'unavailable', reason: 'native-module-missing' };
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    if (__DEV__) {
      console.log('[notifications] permission not granted', finalStatus);
    }
    return { token: null, status: finalStatus, reason: 'permission-not-granted' };
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
  if (!projectId) {
    if (__DEV__) {
      console.warn('[notifications] missing EAS project id for Expo push token');
    }
    return { token: null, status: finalStatus, reason: 'missing-project-id' };
  }

  try {
    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    if (__DEV__) {
      console.log('[notifications] Expo push token:', token.data);
    }
    return { token: token.data, status: finalStatus };
  } catch (error) {
    if (__DEV__) {
      console.warn('[notifications] failed to get Expo push token', error);
    }
    return { token: null, status: finalStatus, reason: 'token-error' };
  }
}

export async function notifyOrderPlaced({
  expoPushToken,
  title,
  body,
  orderId,
}: {
  expoPushToken?: string | null;
  title: string;
  body: string;
  orderId?: string;
}) {
  const Notifications = await getNotificationsModule();

  if (expoPushToken) {
    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: expoPushToken,
          sound: 'default',
          title,
          body,
          data: orderId ? { orderId } : undefined,
        }),
      });
      return;
    } catch {
      // Fall back to a local notification below if the push request fails.
    }
  }

  if (!Notifications) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      data: orderId ? { orderId } : undefined,
    },
    trigger: null,
  });
}
