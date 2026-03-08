import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { LikedItemsProvider } from '@/contexts/LikedItemsContext';

export const unstable_settings = {
  anchor: 'tabs',
};

export default function RootLayout() {
  // Use dark theme for now to avoid conflict when device is in dark mode (light mode to be implemented later)
  const colorScheme = useColorScheme();
  const forceDark = true; // set to false when light mode is ready
  const theme = (forceDark ? 'dark' : colorScheme) === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LikedItemsProvider>
        <ThemeProvider value={theme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="items" options={{ title: "My Listings" }} />
            <Stack.Screen name="auth/login" options={{ title: 'Log In' }} />
            <Stack.Screen name="auth/signup" options={{ title: 'Sign Up' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </LikedItemsProvider>
    </GestureHandlerRootView>
  );
}
