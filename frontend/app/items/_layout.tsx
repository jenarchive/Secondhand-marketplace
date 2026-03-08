import { Stack } from "expo-router";

export default function ItemsLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true,
      headerBackTitleVisible: false,
      headerBackTitle: '',
    }}>
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="transaction/[id]"
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="current-listing" options={{ title: "My Listings" }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
    </Stack>
  );
}