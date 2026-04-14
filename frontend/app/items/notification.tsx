import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, router, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
  
const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';


export default function NotificationScreen() {
  const screenBg = useThemeColor({}, 'background');
  const nav = useRouter();
  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <ThemedView style={[styles.screen, { backgroundColor: screenBg }]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={[styles.header, { backgroundColor: screenBg }]}>
          <Pressable
            onPress={() => nav.back()}
            style={({ pressed }) => [
              styles.headerBackButton,
              { backgroundColor: BACK_BUTTON_BG },
              pressed && styles.headerBackButtonPressed,
            ]}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <ThemedText type="title" style={styles.headerTitle}>
            Notifications
          </ThemedText>
          <Pressable
            style={({ pressed }) => [
              styles.headerMenuButton,
              { backgroundColor: BACK_BUTTON_BG },
              pressed && styles.headerBackButtonPressed,
            ]}
          >
            <Ionicons name="reorder-three" size={28} color="white" />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.listContent}
          contentInsetAdjustmentBehavior="never"
          style={styles.listcontainer}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={() => {
              router.push(`/items/chat`);
            }}
            style={[styles.card, styles.firstCard]}
          >
            <View style={styles.infoContainer}>
              <ThemedText style={styles.productName} numberOfLines={1}>
                You haved matched with user 1.
              </ThemedText>
            </View>
          </Pressable>
        </ScrollView>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
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
  listContent: {
    paddingTop: 112,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  firstCard: {
    marginTop: 0,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  listcontainer: { flex: 1 },
  headerBackButton: {
    marginLeft: 20,
    position: 'absolute',
    left: 0,
    bottom: 0,
    padding: 4,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackButtonPressed: {
    opacity: 0.8,
  },
  headerTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  headerMenuButton: {
    position: 'absolute',
    right: 20,
    bottom: 0,
    padding: 4,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
