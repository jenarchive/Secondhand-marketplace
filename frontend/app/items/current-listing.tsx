import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import { useMemo } from 'react';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import TestData from '@/test-data.json';
import * as Haptics from 'expo-haptics';
import { Colors } from '@/constants/theme';

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

  const myListings = useMemo(() => {
    const shuffled = shuffleArray(TestData.items);
    return shuffled.slice(0, 4);
  }, []);

  const screenBg = '#121212';
  const textColor = Colors.dark.text;
  const placeholderBg = '#2c2c2e';

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <Stack.Screen
        options={{
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerBackButton}
              activeOpacity={0.8}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingTop: 12 }]}
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
  headerBackButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
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
