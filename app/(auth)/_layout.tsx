import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: "Home"}} />
      <Stack.Screen name="signUp"options={{ title: "Register", presentation: 'card', animation: 'slide_from_right'}} />
    </Stack>
  );
}