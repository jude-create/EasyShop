import { Stack } from "expo-router";

export default function OtherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
       <Stack.Screen name="ProductDetailScreen" options={{title: "ProductDetails"}} />
      
    </Stack>
  );
}
