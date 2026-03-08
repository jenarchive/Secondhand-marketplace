import { Image } from 'expo-image';
import { StyleSheet, Pressable, View } from 'react-native';
import { useMemo } from 'react';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import TestData from '@/test-data.json';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function CurrentListingScreen() {
  const router = useRouter();

  const myListings = useMemo(() => {
    const shuffled = shuffleArray(TestData.items);
    return shuffled.slice(0, 4);
  }, []);

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<Image />}
    >
      <ThemedView style={styles.container}>
        <View style={styles.flexbox}>
          {myListings.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.listingLink, pressed && styles.pressed]}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/items/${item.id}`);
              }}
            >
              <ThemedView style={styles.listingContainer}>
                <View style={styles.imageWrapper}>
                  <Image
                    alt={item.title}
                    style={styles.image}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    source={{ uri: item.image }}
                  />
                </View>
                <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.itemTitle}>
                  {item.title}
                </ThemedText>
                <ThemedText type="defaultSemiBold" style={styles.price}>
                  {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
                </ThemedText>
              </ThemedView>
            </Pressable>
          ))}
        </View>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 64,
  },
  listingContainer: {
    padding: 12,
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#25282B',
  },
  listingLink: {
    flexBasis: '48%',
    maxWidth: '48%',
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    borderRadius: 8,
    aspectRatio: 1,
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  itemTitle: {
    color: '#fff',
    flexShrink: 1,
  },
  price: {
    color: '#fff',
    marginTop: 4,
  },
  flexbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pressed: {
    opacity: 0.85,
  },
});
