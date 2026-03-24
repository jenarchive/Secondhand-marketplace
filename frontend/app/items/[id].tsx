import { Image } from 'expo-image';
import { Alert, StyleSheet, Pressable, View, ScrollView, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { useMemo, useSyncExternalStore } from 'react';
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
import {
  subscribePendingMeetup,
  getPendingMeetupVersion,
  isPendingMeetupReservation,
  isItemSoldOnMarketplace,
} from '@/store/pendingMeetupStore';
import {
  LISTING_STAMP_PENDING_COLOR,
  LISTING_STAMP_PENDING_FILL,
  LISTING_STAMP_SOLD_COLOR,
} from '@/constants/listing-stamp';

const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

export default function HomeScreen() {
  const params = useLocalSearchParams<{ id: string; fromMyListings?: string; fromChat?: string }>();
  const id = Number(params.id);
  const fromMyListings = params.fromMyListings === 'true';
  const fromChat = params.fromChat === 'true';
  const { items, isMyListing: isItemMine, removeItem } = useMyListings();
  const itemData = items.find((item) => item.id === id);
  const { toggleLike, isLiked } = useLikedItems();
  const liked = itemData ? isLiked(itemData.id) : false;

  useSyncExternalStore(subscribePendingMeetup, getPendingMeetupVersion, getPendingMeetupVersion);

  const { width: windowWidth } = useWindowDimensions();
  const detailStampScale = useMemo(() => {
    const detailImageWidth = Math.max(1, windowWidth - 48);
    const cardImageApproxWidth = Math.max(1, windowWidth * 0.44);
    const r = detailImageWidth / cardImageApproxWidth;
    return Math.min(2.5, Math.max(1.2, r));
  }, [windowWidth]);

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

  const listingStampLabel = isItemSoldOnMarketplace(itemData.id)
    ? 'SOLD'
    : isPendingMeetupReservation(itemData.id)
      ? 'PENDING'
      : null;
  const buyNowLocked = listingStampLabel !== null;
  const buyNowLabel =
    listingStampLabel === 'SOLD' ? 'Sold' : listingStampLabel === 'PENDING' ? 'Pending' : 'Buy Now';
  const stampAccentColor =
    listingStampLabel === 'SOLD'
      ? LISTING_STAMP_SOLD_COLOR
      : listingStampLabel === 'PENDING'
        ? LISTING_STAMP_PENDING_COLOR
        : LISTING_STAMP_SOLD_COLOR;
  const stampInset = 4 * detailStampScale;
  const stampRectStyle = {
    paddingHorizontal: 5 * detailStampScale,
    paddingVertical: 3 * detailStampScale,
    borderRadius: 4 * detailStampScale,
    borderWidth: Math.min(3, Math.max(1.5, 2 * (detailStampScale / 1.85))),
  };
  const stampTextStyle = {
    fontSize: 9 * detailStampScale,
    letterSpacing: 0.45 * detailStampScale,
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.customHeader, { backgroundColor }]}>
        <TouchableOpacity
          style={[styles.customHeaderBackButton, { backgroundColor: BACK_BUTTON_BG }]}
          onPress={() => router.replace('/(tabs)')}
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
          {listingStampLabel && (
            <View style={[styles.pendingStampWrap, { top: stampInset, left: stampInset }]}>
              <View
                style={[
                  styles.pendingStampRect,
                  stampRectStyle,
                  { borderColor: stampAccentColor },
                  listingStampLabel === 'PENDING' && { backgroundColor: LISTING_STAMP_PENDING_FILL },
                ]}
              >
                <Text style={[styles.pendingStampText, stampTextStyle, { color: stampAccentColor }]}>
                  {listingStampLabel}
                </Text>
              </View>
            </View>
          )}
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
            style={[styles.buyNowButton, buyNowLocked && styles.buyNowButtonStatusLocked]}
            onPress={async () => {
              if (buyNowLocked) return;
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push(`/items/transaction/${id}`);
            }}
            accessibilityLabel={buyNowLabel}
          >
            <ThemedText type="defaultSemiBold" style={styles.buyNowButtonText}>{buyNowLabel}</ThemedText>
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
    borderRadius: 20,
    marginTop: 8,
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
    borderRadius: 16,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    borderRadius: 16,
    aspectRatio: 1,
  },

  pendingStampWrap: {
    position: 'absolute',
    zIndex: 2,
    maxWidth: '55%',
  },
  pendingStampRect: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  pendingStampText: {
    fontWeight: '800',
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
  buyNowButtonStatusLocked: {
    backgroundColor: '#C44536',
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
