import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useMyListings } from '@/contexts/MyListingsContext';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function MatchPreviewScreen() {
  const params = useLocalSearchParams<{ myId?: string; targetId?: string }>();
  const { getItemById } = useMyListings();
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

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <ThemedText type="title" style={styles.title}>Trade Match</ThemedText>
      <ThemedText style={styles.subtitle}>Review selected items for 1:1 exchange</ThemedText>

      <View style={styles.cardsRow}>
        <View style={styles.itemCard}>
          <Image
            source={{ uri: myItem.image }}
            style={styles.itemImage}
            placeholder={{ blurhash }}
            contentFit="cover"
          />
          <ThemedText style={styles.itemCaption}>My listing</ThemedText>
          <ThemedText style={styles.itemTitle} numberOfLines={1}>{myItem.title}</ThemedText>
        </View>

        <View style={styles.itemCard}>
          <Image
            source={{ uri: targetItem.image }}
            style={styles.itemImage}
            placeholder={{ blurhash }}
            contentFit="cover"
          />
          <ThemedText style={styles.itemCaption}>Explore item</ThemedText>
          <ThemedText style={styles.itemTitle} numberOfLines={1}>{targetItem.title}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 20,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  itemCard: {
    flex: 1,
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
  itemCaption: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
});
