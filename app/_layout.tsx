import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import './global.css';
import { CartProvider } from '../context/CartContext';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { WishlistProvider } from '../context/WishlistContext';
import { configureGoogleSignIn } from '../components/auth/googleAuth';

// Outside any component, at the top level:
configureGoogleSignIn();

function AppStack() {
  const { isDark } = useTheme();
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(other)"/>
       
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