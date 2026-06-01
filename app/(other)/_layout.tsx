import { Stack } from "expo-router";
import { useTheme } from "../../context/ThemeContext";
import { StatusBar } from "expo-status-bar";

export default function OtherLayout() {
   const { isDark } = useTheme();
  return (
    <>
    <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="ProductDetailScreen" options={{title: "ProductDetails"}} />
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
