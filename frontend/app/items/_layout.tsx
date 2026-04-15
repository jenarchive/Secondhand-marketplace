import { Stack, useRouter } from "expo-router";
import { Platform, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";

const BACK_BUTTON_BG = "rgba(0,0,0,0.4)";

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
        headerBackVisible: false,
        headerLeftContainerStyle: { borderWidth: 0, backgroundColor: "transparent" },
        headerLeft: () => (
          <View style={{ marginLeft: Platform.OS === "ios" ? 0 : 4, marginTop: 8 }}>
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              style={{
                backgroundColor: BACK_BUTTON_BG,
                padding: 4,
                height: 40,
                width: 40,
                borderRadius: 20,
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 0,
                overflow: "hidden",
                shadowColor: "transparent",
                shadowOpacity: 0,
                shadowRadius: 0,
                shadowOffset: { width: 0, height: 0 },
                elevation: 0,
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          animation: "none",
        }}
      />
      <Stack.Screen
        name="transaction/[id]"
        options={{
          headerShown: false,
          animation: "none",
        }}
      />
      <Stack.Screen
        name="transaction/offer-sent/[id]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="transaction/offer-accepted/[id]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="transaction/rate/[id]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="transaction/rating-submitted/[id]"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen name="current-listing" options={{ title: "My Listings" }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
      <Stack.Screen
        name="setting"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="logout" />
      <Stack.Screen name="purchase-history" />
      <Stack.Screen name="notification" />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}