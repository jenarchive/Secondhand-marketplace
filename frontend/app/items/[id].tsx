import { Image } from 'expo-image';
import { Alert, StyleSheet, Pressable, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserHeader from '@/components/user-header';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { useMyListings } from '@/contexts/MyListingsContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function HomeScreen() {
  const params = useLocalSearchParams<{ id: string; fromMyListings?: string; fromChat?: string }>();
  const id = Number(params.id);
  const fromMyListings = params.fromMyListings === 'true';
  const fromChat = params.fromChat === 'true';
  const { items, isMyListing: isItemMine, removeItem } = useMyListings();
  const itemData = items.find((item) => item.id === id);
  const { toggleLike, isLiked } = useLikedItems();
  const liked = itemData ? isLiked(itemData.id) : false;

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const unifiedMyLocation = items.find((item) => isItemMine(item.id))?.location ?? itemData?.location ?? '';

  if (!itemData) {
    return (
      <View style={[styles.screen, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
        <ThemedText>Item not found</ThemedText>
      </View>
    );
  }

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
  const headerTitleColor = useThemeColor({}, 'text');
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.customHeaderBackButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <ThemedText type="title" style={[styles.customHeaderTitle, { color: headerTitleColor }]} numberOfLines={1}>
          {fromMyListings ? 'Edit Item' : MyData.title}
        </ThemedText>
      </View>
      <View style={styles.screen} key={`item-${id}-${itemData.title}`}>
        <ScrollView
          style={[styles.scrollView, { backgroundColor }]}
          contentContainerStyle={[
            styles.scrollContentWrap,
            {
              paddingTop: 112,
              paddingBottom: 24 + Math.max(insets.bottom, 12) + (!isItemMine(itemData.id) && !fromChat ? 72 : 0),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.detailSection}>
      <ThemedView style={styles.listingContainer}>
        <UserHeader
          itemId={itemData.id}
          userLocation={isItemMine(itemData.id) ? unifiedMyLocation : itemData.location}
          userRating={userRatingValue}
          userId={MyData.id}
          displayName={isItemMine(itemData.id) ? 'Me' : undefined}
        />
        <View style={styles.imageWrapper}>
          <Image
            alt={MyData.title}
            style={styles.image}
            placeholder={{ blurhash }}
            contentFit="cover"
            source={{ uri: MyData.image }}
          />
          {!isItemMine(itemData.id) && (
          <Pressable
            style={styles.likeButton}
            onPress={() => toggleLike(itemData.id)}
            hitSlop={8}
          >
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
          </View>
        </ScrollView>
        {isItemMine(itemData.id) ? (
        <View style={[styles.floatingContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Pressable style={styles.buyButton} onPress={() => router.push(`/items/edit/${itemData.id}`)} accessibilityLabel="Edit">
            <ThemedText type="defaultSemiBold" style={styles.cardText}>Edit</ThemedText>
          </Pressable>
          <Pressable
            style={styles.removeButton}
            onPress={() => {
              Alert.alert(
                'Remove listing',
                'Are you sure you want to remove this listing? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                      removeItem(itemData.id);
                      router.replace('/(tabs)');
                    },
                  },
                ]
              );
            }}
            accessibilityLabel="Remove"
          >
            <ThemedText type="defaultSemiBold" style={styles.cardText}>Remove</ThemedText>
          </Pressable>
        </View>
        ) : !fromChat ? (
        <View style={[styles.floatingContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
          <Pressable
            style={styles.buyNowButton}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/items/transaction/${id}`);
            }}
            accessibilityLabel="Buy Now"
          >
            <ThemedText type="defaultSemiBold" style={styles.buyNowButtonText}>Buy Now</ThemedText>
          </Pressable>
        </View>
        ) : null}
      </View>
    </>
  );
}

const colours = {
  container: '#25282B',
  button: '#28289D',
};

const styles = StyleSheet.create({
  customHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 100,
  },
  customHeaderBackButton: {
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
  customHeaderTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  screen: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentWrap: {
    paddingHorizontal: 24,
  },
  detailSection: {},
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
  buyNowButton: {
    backgroundColor: '#0047AB',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyNowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  removeButton: {
    backgroundColor: '#C44536',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    minWidth: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
