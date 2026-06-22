import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ReactNode, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import './global.css';
import { CartProvider, useCart } from '../context/CartContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { WishlistProvider } from '../context/WishlistContext';
import { ProfileProvider, useProfile } from '../context/ProfileContext';
import { OrderHistoryProvider } from '../context/OrderHistoryContext';
import { SavedAddressesProvider } from '../context/SavedAddressesContext';
import { configureGoogleSignIn } from '../components/auth/googleAuth';
import { configureNotifications } from '../lib/notifications';
import { prefetchStrapiCatalog } from '../lib/strapi';

// Outside any component, at the top level:
configureGoogleSignIn();
configureNotifications();
void SplashScreen.preventAutoHideAsync().catch(() => {});

function AppStack() {
  const { colors, isDark } = useTheme();

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background).catch(() => {});
  }, [colors.background]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(other)"/>
       
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

function CatalogWarmup() {
  useEffect(() => {
    void prefetchStrapiCatalog();
  }, []);

  return null;
}

function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { authLoading, profile } = useProfile();
  const { hydrated: cartHydrated } = useCart();
  const appReady = !authLoading && cartHydrated;

  useEffect(() => {
    if (!appReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (profile && inAuthGroup) {
      router.replace('/(tabs)/home');
    } else if (!profile && !inAuthGroup) {
      router.replace('/(auth)');
    }
  }, [appReady, profile, router, segments]);

  useEffect(() => {
    if (appReady) {
      void SplashScreen.hideAsync().catch(() => {});
    }
  }, [appReady]);

  if (!appReady) return null;

  return <>{children}</>;
}

function NotificationBridge() {
  const router = useRouter();

  useEffect(() => {
    const receivedListener = Notifications.addNotificationReceivedListener((notification) => {
      if (__DEV__) {
        console.log('[notifications] received notification', notification.request.content);
      }
    });

    // If the user taps a notification while the app is already open, jump them to order history.
    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      const orderId = response.notification.request.content.data?.orderId;
      if (__DEV__) {
        console.log('[notifications] response received', response.notification.request.content);
      }
      if (orderId) {
        router.push('/(other)/orderHistory');
      }
    });

    // Handle the cold-start case where the app opens from a notification tap.
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        const orderId = response?.notification.request.content.data?.orderId;
        if (orderId) {
          router.push('/(other)/orderHistory');
        }
      })
      .catch(() => {});

    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
  }, [router]);

  return null;
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProfileProvider>
        <CartProvider>
          <WishlistProvider>
            <SavedAddressesProvider>
              <OrderHistoryProvider>
                <CatalogWarmup />
                <AuthGate>
                  <NotificationBridge />
                  <AppStack />
                </AuthGate>
              </OrderHistoryProvider>
            </SavedAddressesProvider>
          </WishlistProvider>
        </CartProvider>
      </ProfileProvider>
    </ThemeProvider>
  );
}
