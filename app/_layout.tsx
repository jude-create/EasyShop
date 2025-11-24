import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import "./global.css"
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CartProvider } from './context/CartContext';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CartProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
       
       
        
      </Stack>
      <StatusBar />
    
      <StatusBar style="auto" />
    </ThemeProvider>
    </CartProvider>
  );
}
