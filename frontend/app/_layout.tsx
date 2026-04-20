import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { MyListingsProvider } from '@/contexts/MyListingsContext';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { LikedItemsProvider } from '@/contexts/LikedItemsContext';
import { AuthProvider } from '@/contexts/AuthContext';


export const unstable_settings = {
  anchor: 'tabs',
};

export default function RootLayout() {
  const theme = DarkTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
      <LikedItemsProvider>
        <MyListingsProvider>
        <ThemeProvider value={theme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="items" options={{ headerShown: false }} />
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
        </MyListingsProvider>
      </LikedItemsProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
