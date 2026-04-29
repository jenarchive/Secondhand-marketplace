import { Pressable, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useMyListings } from '@/contexts/MyListingsContext';
import { useThemeColor } from '@/hooks/use-theme-color';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function MatchPreviewScreen() {
  const params = useLocalSearchParams<{
    myId?: string;
    targetId?: string;
    source?: string;
    fromMarketplace?: string;
    fromExplore?: string;
    fromLikedItems?: string;
  }>();
  const router = useRouter();
  const { getItemById, addNotification } = useMyListings();
  const backgroundColor = useThemeColor({}, 'background');
  const myId = Number(params.myId);
  const targetId = Number(params.targetId);
  const myItem = Number.isFinite(myId) ? getItemById(myId) : undefined;
  const targetItem = Number.isFinite(targetId) ? getItemById(targetId) : undefined;

  if (!myItem || !targetItem) {
    return (
      <View style={[styles.screen, styles.center, { backgroundColor }]}>
        <ThemedText>Match items not found.</ThemedText>
      </View>
    );
  }

  const handleSendOffer = () => {
    const mId = Number(myId);
    const tId = Number(targetId);

    // Update the notifications stack globally
    addNotification(mId, tId);

    // Direct the user to the chat page with the chosen items
    router.replace({
      pathname: '/items/chat', 
      params: { 
        myId: String(mId), 
        targetId: String(tId),
        source: params.source,
        fromMarketplace: params.fromMarketplace,
        fromExplore: params.fromExplore,
        fromLikedItems: params.fromLikedItems,
      },
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <View style={[styles.header, { backgroundColor }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <ThemedText type="title" style={styles.headerTitle}>Trade Match</ThemedText>
      </View>
      <View style={styles.contentWrap}>
        <View style={styles.cardsRow}>
          <View style={styles.itemColumn}>
            <ThemedText style={[styles.cardTopLabel, styles.cardTopLabelMy]}>My Listing</ThemedText>
            <Pressable style={styles.itemCard} onPress={() => router.push(`/items/${myItem.id}`)}>
              <Image
                source={{ uri: myItem.image }}
                style={styles.itemImage}
                placeholder={{ blurhash }}
                contentFit="cover"
              />
              <ThemedText style={styles.itemTitle} numberOfLines={1}>{myItem.title}</ThemedText>
              <ThemedText style={styles.itemDescription} numberOfLines={2}>
                {myItem.description}
              </ThemedText>
            </Pressable>
          </View>

          <View style={styles.itemColumn}>
            <ThemedText style={[styles.cardTopLabel, styles.cardTopLabelMatch]}>Item to Match</ThemedText>
            <Pressable style={styles.itemCard} onPress={() => router.push(`/items/${targetItem.id}`)}>
              <Image
                source={{ uri: targetItem.image }}
                style={styles.itemImage}
                placeholder={{ blurhash }}
                contentFit="cover"
              />
              <ThemedText style={styles.itemTitle} numberOfLines={1}>{targetItem.title}</ThemedText>
              <ThemedText style={styles.itemDescription} numberOfLines={2}>
                {targetItem.description}
              </ThemedText>
            </Pressable>
          </View>
          <View pointerEvents="none" style={styles.tradeIconWrap}>
            <Ionicons name="swap-horizontal" size={30} color="#FFFFFF" />
          </View>
        </View>
        <Pressable style={styles.sendButton} onPress={handleSendOffer}>
          <ThemedText style={styles.sendButtonText}>Send match offer</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
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
  headerTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 0,
    paddingTop: 10,
    transform: [{ translateY: -36 }],
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
  },
  itemColumn: {
    flex: 1,
    alignItems: 'center',
  },
  cardTopLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardTopLabelMy: {
    color: '#FFFFFF',
  },
  cardTopLabelMatch: {
    color: '#FF9500',
  },
  itemCard: {
    width: '100%',
    borderRadius: 14,
    padding: 10,
    backgroundColor: '#25282B',
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 12,
    opacity: 0.8,
    lineHeight: 17,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 4,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    marginTop: 24,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A84FF',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  tradeIconWrap: {
    position: 'absolute',
    left: '50%',
    top: '46%',
    marginLeft: -15,
    marginTop: -15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
});
