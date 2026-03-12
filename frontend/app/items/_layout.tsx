import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen name="current-listing" />
      <Stack.Screen name="setting" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="logout" />
      <Stack.Screen name="purchase-history" />
      <Stack.Screen name="notification" />
    </Stack>
  );
}