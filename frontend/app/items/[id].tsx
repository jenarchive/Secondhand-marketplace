import { Image } from 'expo-image';
import { Alert, StyleSheet, Pressable, View, ScrollView, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { useCallback, useMemo, useState, useSyncExternalStore } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import UserHeader from '@/components/user-header';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { useMyListings } from '@/contexts/MyListingsContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  subscribePendingMeetup,
  getPendingMeetupVersion,
  isPendingMeetupReservation,
  isItemSoldOnMarketplace,
} from '@/store/pendingMeetupStore';
import { LISTING_STAMP_PENDING_COLOR, LISTING_STAMP_SOLD_COLOR } from '@/constants/listing-stamp';

const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

export default function HomeScreen() {
  const params = useLocalSearchParams<{ id: string; fromMyListings?: string; fromChat?: string; fromExplore?: string; fromMarketplace?: string; source?: string }>();
  const id = Number(params.id);
  const fromMyListings = params.fromMyListings === 'true';
  const fromChat = params.fromChat === 'true';
  const fromExplore = params.fromExplore === 'true';
  const fromMarketplace = params.fromMarketplace === 'true';
  const source = params.source;
  const { items, isMyListing: isItemMine, removeItem } = useMyListings();
  const myListingItems = useMemo(
    () => items.filter((item) => isItemMine(item.id)),
    [items, isItemMine]
  );
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
  const soldOnMarketplace = isItemSoldOnMarketplace(itemData.id);
  const pendingMeetup = !soldOnMarketplace && isPendingMeetupReservation(itemData.id);
  const listingStampLabel = soldOnMarketplace ? 'SOLD' : pendingMeetup ? 'PENDING' : null;
  const stampAccentColor = soldOnMarketplace ? LISTING_STAMP_SOLD_COLOR : LISTING_STAMP_PENDING_COLOR;
  const stampInset = 8;
  const stampRectStyle = {
    borderWidth: Math.max(2, 2.4 * detailStampScale),
    borderRadius: 4 * detailStampScale,
    paddingHorizontal: 5 * detailStampScale,
    paddingVertical: 3 * detailStampScale,
  };
  const buyNowLocked = soldOnMarketplace || pendingMeetup;
  const buyNowLabel = soldOnMarketplace ? 'Sold' : pendingMeetup ? 'Pending' : 'Buy Now';

  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, 'background');
  const headerTitleColor = useThemeColor({}, 'text');
  const colorScheme = useColorScheme() ?? 'light';
  const detailCardBg = colorScheme === 'dark' ? colours.container : 'rgba(0,0,0,0.12)';
  const detailPrimaryTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#111827';
  const detailSecondaryTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#374151';
  const router = useRouter();
  const [matchPickerVisible, setMatchPickerVisible] = useState(false);
  const [selectedMyListingId, setSelectedMyListingId] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      setMatchPickerVisible(false);
      setSelectedMyListingId(null);
    }, []),
  );
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
          onPress={() => {
            if (fromChat) {
              router.back();
              return;
            }
            if (router.canGoBack()) {
              router.back();
              return;
            }
            if (source === 'marketplace') {
              router.replace('/(tabs)/marketplace');
              return;
            }
            if (source === 'explore') {
              router.replace('/(tabs)/explore');
              return;
            }
            if (fromMarketplace) {
              router.replace('/(tabs)/marketplace');
              return;
            }
            if (fromExplore) {
              router.replace('/(tabs)/explore');
              return;
            }
            router.replace('/(tabs)/explore');
          }}
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
              style={({ pressed }) => [
                styles.matchBadge,
                pressed && styles.matchBadgePressed,
                matchPickerVisible && styles.matchBadgeActive,
              ]}
              onPress={() => {
                setSelectedMyListingId(null);
                setMatchPickerVisible((prev) => !prev);
              }}
              hitSlop={8}
            >
              <Ionicons
                name="swap-horizontal"
                size={28}
                color={matchPickerVisible ? '#0A84FF' : '#FFFFFF'}
              />
            </Pressable>
          )}
          {!isItemMine(itemData.id) && matchPickerVisible && (
            <View style={styles.matchPickerPanel}>
              <ThemedText style={styles.matchPickerTitle}>Match with my listing</ThemedText>
              {myListingItems.length === 0 ? (
                <ThemedText style={styles.matchPickerEmpty}>No my listings yet</ThemedText>
              ) : (
                myListingItems.map((myItem) => {
                  const selected = selectedMyListingId === myItem.id;
                  return (
                    <Pressable
                      key={myItem.id}
                      style={[
                        styles.matchPickerItem,
                        selected && styles.matchPickerItemSelected,
                      ]}
                      onPress={() => setSelectedMyListingId(myItem.id)}
                    >
                      <Image
                        source={{ uri: myItem.image }}
                        style={styles.matchPickerItemThumb}
                        contentFit="cover"
                      />
                      <ThemedText
                        numberOfLines={1}
                        style={[
                          styles.matchPickerItemText,
                          selected && styles.matchPickerItemTextSelected,
                        ]}
                      >
                        {myItem.title}
                      </ThemedText>
                      {selected && (
                        <Pressable
                          style={styles.matchInlineConfirmButton}
                          onPress={() =>
                            router.push({
                              pathname: '/items/match-preview',
                              params: {
                                targetId: String(itemData.id),
                                myId: String(myItem.id),
                              },
                            })
                          }
                        >
                          <ThemedText style={styles.matchInlineConfirmButtonText}>
                            Confirm
                          </ThemedText>
                        </Pressable>
                      )}
                    </Pressable>
                  );
                })
              )}
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
        <ThemedView style={[styles.listingTitle, { backgroundColor: detailCardBg }]}>
          <ThemedText type="defaultSemiBold" style={[styles.cardText, { color: detailPrimaryTextColor }]}>{MyData.title}</ThemedText>
          <ThemedText type="default" style={[styles.cardText, { color: detailSecondaryTextColor }]}>Category: {MyData.category}</ThemedText>
          <ThemedView style={styles.priceContainer}>
            <ThemedText type="default" style={[styles.cardText, { color: detailSecondaryTextColor }]}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(MyData.price)}
            </ThemedText>
            <ThemedText type="default" style={[styles.cardText, { color: detailSecondaryTextColor }]}>
              Price Incl Postage: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(MyData.price + 5)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={[styles.listingDescription, { backgroundColor: detailCardBg }]}>
          <ThemedView style={styles.descriptionInner}>
            <ThemedText type="defaultSemiBold" style={[styles.cardText, { color: detailPrimaryTextColor }]}>Description</ThemedText>
            <ThemedText type="default" style={[styles.cardText, { color: detailSecondaryTextColor }]}>{MyData.description}</ThemedText>
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
  matchBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  matchBadgePressed: {
    opacity: 0.75,
  },
  matchBadgeActive: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  matchPickerPanel: {
    position: 'absolute',
    top: 56,
    left: 8,
    zIndex: 30,
    minWidth: 190,
    maxWidth: 240,
    borderRadius: 14,
    padding: 10,
    backgroundColor: '#FFFFFF',
    gap: 6,
  },
  matchPickerTitle: {
    color: '#1F2937',
    fontSize: 12,
    fontWeight: '600',
  },
  matchPickerEmpty: {
    color: '#6B7280',
    fontSize: 12,
  },
  matchPickerItem: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  matchPickerItemSelected: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#60A5FA',
  },
  matchPickerItemThumb: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  matchPickerItemText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  matchPickerItemTextSelected: {
    color: '#1D4ED8',
  },
  matchInlineConfirmButton: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A84FF',
  },
  matchInlineConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: 'transparent',
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
