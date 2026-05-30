import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';

function AppStack() {
  const { isDark } = useTheme();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="product/[id]"
          options={{
            presentation: 'card',
            animation: 'slide_from_right',
          }}
        />
        <Stack.Screen
          name="orderHistory"
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            presentation: 'card',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="orderSuccess"
          options={{
            presentation: 'fullScreenModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen name="editProfile" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="savedAddresses" options={{ presentation: 'card', animation: 'slide_from_right' }} />
        <Stack.Screen name="paymentMethods" options={{ presentation: 'card', animation: 'slide_from_right' }} />
       
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <WishlistProvider>
        <CartProvider>
          <AppStack />
        </CartProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}