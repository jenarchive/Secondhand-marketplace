import { useMemo, useSyncExternalStore } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useMyListings } from '@/contexts/MyListingsContext';
import type { ChatListNotificationType } from '@/contexts/MyListingsContext';
import { Image } from 'expo-image';
import {
  subscribePendingMeetup,
  getPendingMeetupVersion,
  isPendingMeetupReservation,
  isItemSoldOnMarketplace,
} from '@/store/pendingMeetupStore';

const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

const LABEL_MATCH = 'Match in progress';
const LABEL_PURCHASE = 'Purchase in progress';
const LABEL_BOUGHT = 'Bought';

const COLOR_MATCH = '#3B82F6';
const COLOR_PURCHASE = '#16A34A';
const COLOR_BOUGHT = '#EF4444';

function isBoughtOrReservedItem(itemId: number): boolean {
  return isItemSoldOnMarketplace(itemId) || isPendingMeetupReservation(itemId);
}

function statusLabelAndColor(
  kind: ChatListNotificationType,
  itemId: number,
  pendingSnapshot: number
): { label: string; color: string } {
  void pendingSnapshot;
  if (kind === 'MATCH_OFFER') {
    return { label: LABEL_MATCH, color: COLOR_MATCH };
  }
  if (isBoughtOrReservedItem(itemId)) {
    return { label: LABEL_BOUGHT, color: COLOR_BOUGHT };
  }
  return { label: LABEL_PURCHASE, color: COLOR_PURCHASE };
}

export default function YourChatsScreen() {
  const screenBg = useThemeColor({}, 'background');
  const nav = useRouter();
  const { notifications, getItemById } = useMyListings();
  const pendingVersion = useSyncExternalStore(
    subscribePendingMeetup,
    getPendingMeetupVersion,
    getPendingMeetupVersion
  );

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
    [notifications]
  );

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
            My Chats
          </ThemedText>
        </View>

        <ScrollView
          contentContainerStyle={sortedNotifications.length === 0 ? { flex: 1 } : styles.listContent}
          style={styles.listcontainer}
        >
          {sortedNotifications.length === 0 ? (
            <View style={styles.emptyStateCenter}>
              <ThemedText style={styles.emptyText}>
                No chats yet
              </ThemedText>
            </View>
          ) : (
            sortedNotifications.map((notif) => {
              const kind: ChatListNotificationType = notif.type ?? 'MATCH_OFFER';
              const itemId = notif.targetId;
              const { label, color } = statusLabelAndColor(kind, itemId, pendingVersion);
              return (
                <Pressable
                  key={notif.id}
                  onPress={() => {
                    if (kind === 'MATCH_OFFER') {
                      nav.push({
                        pathname: '/items/chat',
                        params: { myId: notif.myId, targetId: notif.targetId },
                      });
                      return;
                    }
                    nav.push({
                      pathname: '/items/chat/[id]',
                      params: {
                        id: String(itemId),
                        sellerName: `User${itemId}`,
                        fromTransaction: 'true',
                      },
                    });
                  }}
                  style={styles.card}
                >
                  <Image
                    source={{ uri: getItemById(itemId)?.image }}
                    style={styles.chatItemThumb}
                    contentFit="cover"
                  />
                  <View style={styles.infoContainer}>
                    <ThemedText style={[styles.statusLabelText, { color }]}>
                      {label}
                    </ThemedText>
                    <ThemedText style={styles.productName}>
                      {`${getItemById(itemId)?.title || 'Unknown Item'} `}
                      <ThemedText style={styles.withUserText}>
                        {`with User ${itemId}`}
                      </ThemedText>
                    </ThemedText>
                    <ThemedText style={styles.matchTimeText}>
                      {notif.timestamp.toLocaleDateString()} {notif.timestamp.toLocaleTimeString()}
                    </ThemedText>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="gray" />
                </Pressable>
              );
            })
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
  chatItemThumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 16,
    backgroundColor: '#25282B',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  statusLabelText: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  withUserText: {
    fontSize: 13,
    fontWeight: '400',
  },
  matchTimeText: {
    fontSize: 12,
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
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyStateCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
