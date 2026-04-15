import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { MyListingsProvider } from '@/contexts/MyListingsContext';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { LikedItemsProvider } from '@/contexts/LikedItemsContext';
import { AuthProvider } from '@/contexts/AuthContext';


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
          <StatusBar style="auto" />
        </ThemeProvider>
        </MyListingsProvider>
      </LikedItemsProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
