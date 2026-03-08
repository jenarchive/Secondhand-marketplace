import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import { useMemo } from 'react';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import TestData from '@/test-data.json';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function CurrentListingScreen() {
  const router = useRouter();
  const headerTitleColor = useThemeColor({}, 'text');
  const screenBg = useThemeColor({ light: '#fff', dark: '#000' }, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderBg = useThemeColor({ light: '#e5e5e5', dark: '#2c2c2e' }, 'background');

  const myListings = useMemo(() => {
    const shuffled = shuffleArray(TestData.items);
    return shuffled.slice(0, 4);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText type="title" style={[styles.pageTitle, { color: headerTitleColor }]}>My Listings</ThemedText>
      </View>
      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingTop: 112 }]}
        contentInsetAdjustmentBehavior="never"
        style={{ backgroundColor: screenBg }}
        showsVerticalScrollIndicator={false}
      >
        {myListings.map((item, index) => (
          <Pressable
            key={item.id}
            style={[styles.card, index === 0 && styles.firstCard]}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/items/${item.id}?fromMyListings=true`);
            }}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: item.image }}
                alt={item.title}
                style={[styles.imagePlaceholder, { backgroundColor: placeholderBg }]}
                placeholder={{ blurhash }}
                contentFit="cover"
              />
            </View>
            <View style={styles.infoContainer}>
              <ThemedText style={[styles.productName, { color: textColor }]} numberOfLines={1}>
                {item.title}
              </ThemedText>
              <ThemedText style={[styles.price, { color: textColor }]}>
                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </ScrollView>
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
  },
  pageTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  listContent: {
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
  imageWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 12,
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
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
