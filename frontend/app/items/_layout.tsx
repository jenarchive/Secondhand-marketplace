import { Stack } from "expo-router";

export default function ItemsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="current-listing"
        options={{ title: "My Listings" }}
      />
    </Stack>
  );
}