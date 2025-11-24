import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" options={{ title: "Log in"}} />
      <Stack.Screen name="signUp"options={{ title: "Register"}} />
    </Stack>
  );
}
