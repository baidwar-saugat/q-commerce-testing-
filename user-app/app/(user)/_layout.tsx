import { Stack } from "expo-router";

export default function UserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* This loads the Tab Navigator inside (user)/(tabs) */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
