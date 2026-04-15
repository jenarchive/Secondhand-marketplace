import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

export default function SettingsScreen() {
  const router = useRouter();
  const screenBg = useThemeColor({}, 'background');
  const headerTitleColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { backgroundColor: screenBg }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: BACK_BUTTON_BG }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText type="title" style={[styles.pageTitle, { color: headerTitleColor }]}>
          Settings
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 100,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 0,
    padding: 4,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 20,
  },
  pageTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
});
