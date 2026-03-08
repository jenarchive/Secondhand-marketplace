import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import TestData from '@/test-data.json';
import { ThemedText } from '@/components/themed-text';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import UserHeader from '@/components/user-header';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {

  const params = useLocalSearchParams<{ id: string; fromMyListings?: string }>();
  const id = Number(params.id);
  const isMyListing = params.fromMyListings === 'true';
  const itemData = TestData.items[id - 1];
  const { toggleLike, isLiked } = useLikedItems();
  const liked = isLiked(itemData.id);

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const MyData = {
    id: itemData.id,
    title: itemData.title,
    description: itemData.description,
    price: itemData.price,
    image: itemData.image,
    category: itemData.category,
    location: itemData.location
  };

  const userRatingValue: number = typeof (itemData as any).rating === 'number' ? (itemData as any).rating : 4;

  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const router = useRouter();

  const handleBuy = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
    // TODO: implement buy logic
    console.log('Buy now', MyData.id);
  };

  const handleMakeOffer = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid); } catch {}
    // TODO: make-offer modal
    console.log('Make offer', MyData.id);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: isMyListing ? 'Edit Item' : MyData.title,
          headerBackTitleVisible: false,
          headerBackTitle: '',
          ...(isMyListing && {
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
          }),
        }}
      />
      <View style={styles.screen}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor }]}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: 24 + Math.max(insets.bottom, 12) + (isMyListing ? 0 : 280) }]}
          showsVerticalScrollIndicator={false}
        >
      <ThemedView style={styles.listingContainer}>
        {!isMyListing && (
        <UserHeader itemId={itemData.id} userLocation={itemData.location} userRating={userRatingValue} userId={MyData.id} />
        )}
        <View style={styles.imageWrapper}>
          <Image
            alt={MyData.title}
            style={styles.image}
            placeholder={{ blurhash }}
            contentFit="cover"
            source={{ uri: MyData.image }}
          />
          {!isMyListing && (
          <Pressable style={styles.likeButton} onPress={() => toggleLike(itemData.id)} hitSlop={8}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={28} color={liked ? '#FF3B30' : '#FFFFFF'} />
          </Pressable>
          )}
        </View>
        <ThemedView style={styles.listingTitle}>
          <ThemedText type="defaultSemiBold" style={styles.cardText}>{MyData.title}</ThemedText>
          <ThemedText type="default" style={styles.cardText}>Category: {MyData.category}</ThemedText>
          <ThemedView style={styles.priceContainer}>
            <ThemedText type="default" style={styles.cardText}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(MyData.price)}
            </ThemedText>
            <ThemedText type="default" style={styles.cardText}>
              Price Incl Postage: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(MyData.price + 5)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.listingDescription}>
          <ThemedView style={styles.descriptionInner}>
            <ThemedText type="defaultSemiBold" style={styles.cardText}>Description</ThemedText>
            <ThemedText type="default" style={styles.cardText}>{MyData.description}</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
        </ScrollView>
        {!isMyListing && (
        <View style={[styles.floatingContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <Pressable style={styles.buyButton} onPress={handleBuy} accessibilityLabel="Buy now">
        <ThemedText type="defaultSemiBold" style={styles.cardText}>Buy Now</ThemedText>
      </Pressable>
      <Pressable style={styles.offerButton} onPress={handleMakeOffer} accessibilityLabel="Make offer">
        <ThemedText type="defaultSemiBold" style={styles.cardText}>Make Offer</ThemedText>
        </Pressable>
        </View>
        )}
      </View>
    </>
  );
}

const colours = {
  container: '#25282B',
  button: '#28289D',
};

const styles = StyleSheet.create({
  headerBackButton: {
    marginLeft: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  listingContainer: {
    gap: 12,
  },

  listingTitle: {
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: colours.container,
    borderRadius: 16,
  },

  imageWrapper: {
    position: 'relative',
  },

  image: {
    width: '100%',
    borderRadius: 16,
    aspectRatio: 1,
  },

  likeButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: colours.container,
  },

  listingDescription: {
    gap: 16,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: colours.container,
    borderRadius: 16,
  },

  descriptionInner: {
    backgroundColor: 'transparent',
  },

  cardText: {
    color: '#fff',
  },

  floatingContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 'auto',
    alignItems: 'center',
    zIndex: 1000,
  },
  buyButton: {
    backgroundColor: colours.button,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginRight: 15,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },

  offerButton: {
    backgroundColor: colours.button,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
