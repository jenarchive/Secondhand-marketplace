import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import * as Haptics from 'expo-haptics';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useMyListings } from '@/contexts/MyListingsContext';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function CurrentListingScreen() {
  const router = useRouter();
  const { myListings } = useMyListings();
  const headerTitleColor = useThemeColor({}, 'text');
  const screenBg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderBg = useThemeColor({ light: '#e5e5e5', dark: '#2c2c2e' }, 'background');

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <Stack.Screen options={{ headerShown: false }} />
      {myListings.length > 0 && (
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
      )}
      {myListings.length === 0 ? (
        <View style={[styles.emptyStateCenter, { backgroundColor: screenBg }]}>
          <View style={styles.emptyStateAbove}>
            <ThemedText style={[styles.emptyText, { color: textColor }]}>
              No Listings Yet
            </ThemedText>
          </View>
          <View style={styles.emptyStateButtonAtCenter}>
            <Pressable
              style={({ pressed }) => [pressed && { opacity: 0.85 }]}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.replace('/(tabs)/sell');
              }}
            >
              <ThemedView style={styles.sellButton}>
                <ThemedText style={styles.sellButtonText}>Go to Sell page</ThemedText>
              </ThemedView>
            </Pressable>
          </View>
        </View>
      ) : (
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
              router.push(`/items/edit/${item.id}`);
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
      )}
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
  emptyStateCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  emptyStateAbove: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '50%',
    marginBottom: 52,
    alignItems: 'center',
  },
  emptyStateButtonAtCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    alignItems: 'center',
    transform: [{ translateY: -30 }],
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  sellButton: {
    width: 300,
    height: 60,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28289D',
  },
  sellButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
