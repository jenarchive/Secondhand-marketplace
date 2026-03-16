import { Stack, useRouter } from "expo-router";
import { Pressable, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";

export default function ItemsLayout() {
  const router = useRouter();
  const headerBg = useThemeColor({}, "background");
  const headerTint = useThemeColor({}, "text");

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: headerBg },
        headerTintColor: headerTint,
        headerBackTitleVisible: false,
        headerBackTitle: "",
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, padding: 8, marginLeft: Platform.OS === "ios" ? 0 : 4 })}
          >
            <Ionicons name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"} size={28} color={headerTint} />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen name="[id]" />
      <Stack.Screen
        name="transaction/[id]"
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="current-listing" options={{ title: "My Listings" }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
      <Stack.Screen name="setting" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="logout" />
      <Stack.Screen name="purchase-history" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}