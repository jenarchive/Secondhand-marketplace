import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, router, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useMyListings } from '@/contexts/MyListingsContext';
import { Image } from 'expo-image';
  
const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

export default function NotificationScreen() {
  const screenBg = useThemeColor({}, 'background');
  const nav = useRouter();
  const { notifications, getItemById } = useMyListings();
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
            My Matches
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
          contentContainerStyle={notifications.length === 0 ? { flex: 1 } : styles.listContent}
          style={styles.listcontainer}
        >
          {notifications.length === 0 ? (
            <View style={styles.centeredEmptyState}>
              <ThemedText style={styles.emptyText}>
                No liked items yet
              </ThemedText>
            </View>
          ) : (
            notifications.map((notif) => (
              <Pressable
                key={notif.id}
                onPress={() => {
                  router.push({
                    pathname: '/items/chat',
                    params: { myId: notif.myId, targetId: notif.targetId }
                  });
                }}
                style={styles.card}
              >
                <Image
                  source={{ uri: getItemById(notif.targetId)?.image }}
                  style={styles.matchItemThumb}
                  contentFit="cover"
                />
                <View style={styles.infoContainer}>
                  <ThemedText style={styles.productName}>
                    {`User ${notif.targetId} × ${getItemById(notif.targetId)?.title || 'Unknown Item'}`}
                  </ThemedText>
                  <ThemedText style={styles.matchTimeText}>
                    {notif.timestamp.toLocaleDateString()} {notif.timestamp.toLocaleTimeString()}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={20} color="gray" />
              </Pressable>
            ))
          )}

          {notifications.length === 0 && (
            <View style={[styles.emptyStateCenter, { backgroundColor: screenBg }]}>
              <View style={styles.emptyStateAbove}>
                <ThemedText style={[styles.emptyText]}>
                  No liked items yet
                </ThemedText>
              </View>
            </View>
          )}
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
    paddingTop: 118,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.16)',
    paddingBottom: 18,
  },
  matchItemThumb: {
    width: 54,
    height: 54,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#25282B',
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
  matchTimeText: {
    fontSize: 11,
    opacity: 0.62,
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
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    justifyContent: 'center',
  },
  emptyStateCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  centeredEmptyState: {
  flex: 1,
  justifyContent: 'center', 
  alignItems: 'center',     
  paddingTop: 100, 
},
  emptyStateAbove: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '50%',
    marginBottom: 52,
    alignItems: 'center',
  },
});
