import { Image } from 'expo-image';
import { Alert, Platform, StyleSheet, Pressable, TextInput, View, Modal, FlatList, TouchableOpacity, Text } from 'react-native';
import { useState, useMemo, useEffect, useSyncExternalStore } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { DarkTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { useMyListings } from '@/contexts/MyListingsContext';
import { CATEGORIES } from '@/constants/categories';
import { LISTING_STAMP_PENDING_COLOR, LISTING_STAMP_SOLD_COLOR } from '@/constants/listing-stamp';
import {
  subscribePendingMeetup,
  getPendingMeetupVersion,
  isPendingMeetupReservation,
  isItemSoldOnMarketplace,
} from '@/store/pendingMeetupStore';

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { toggleLike, isLiked } = useLikedItems();
  const { items: contextItems, isMyListing } = useMyListings();
  const [displayItems, setDisplayItems] = useState<typeof contextItems>([]);

  useSyncExternalStore(subscribePendingMeetup, getPendingMeetupVersion, getPendingMeetupVersion);

  useEffect(() => {
    setDisplayItems([...contextItems]);
  }, [contextItems]);

  const filtered = useMemo(() => {
    let list = displayItems;
    if (selectedCategory) {
      const sel = selectedCategory.toLowerCase();
      list = list.filter((i) => {
        const cat = (i.category || '').toLowerCase();
        if (cat.includes(sel)) return true;
        if (sel === 'home' && cat.includes('furniture')) return true;
        if (sel === 'entertainment' && (cat.includes('musical') || cat.includes('entertainment'))) return true;
        return false;
      });
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((i) =>
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      (i.category || '').toLowerCase().includes(q)
    );
  }, [query, selectedCategory, displayItems]);

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#191C1F' }}
      headerImage={<Image />}>
      <ThemedView>
        <View style={[styles.searchContainer, { paddingTop: insets.top + 8 }]}>
          <View style={styles.searchInner}>
            <Pressable
              onPress={() => setCategoryModalVisible(true)}
              hitSlop={8}
              style={styles.categoryIconWrap}
            >
              <Ionicons name="pricetag-outline" size={20} color="#888" />
            </Pressable>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search items, categories or descriptions"
              placeholderTextColor="#888"
              style={styles.searchInput}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            <Ionicons name="search" size={18} color="#888" style={styles.searchIconRight} />
          </View>
        </View>

        <Modal
          visible={categoryModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setCategoryModalVisible(false)} />
            <View style={styles.categoryModalContent}>
              <View style={styles.categoryModalHeader}>
                <ThemedText type="subtitle">Select category</ThemedText>
                <Pressable onPress={() => setCategoryModalVisible(false)} hitSlop={12}>
                  <Ionicons name="close" size={24} color="#888" />
                </Pressable>
              </View>
              <Pressable onPress={() => { setSelectedCategory(null); setCategoryModalVisible(false); }} style={styles.categoryOption}>
                <ThemedText style={styles.categoryOptionText}>All</ThemedText>
                {!selectedCategory && <Ionicons name="checkmark" size={20} color="#0A84FF" />}
              </Pressable>
              <FlatList
                data={CATEGORIES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryOption}
                    onPress={() => {
                      setSelectedCategory(item.name);
                      setCategoryModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <ThemedText style={styles.categoryOptionText}>{item.name}</ThemedText>
                    {selectedCategory === item.name && <Ionicons name="checkmark" size={20} color="#0A84FF" />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
        <ThemedView style={styles.flexbox}>
            {filtered.map((item) => (
              <Pressable
                key={`${item.id}-${item.title}`}
                style={({ pressed }) => [styles.listingLink, pressed && styles.pressed]}
                onPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push(`/items/${item.id}`);
                }}
                onLongPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  router.push(`/items/${item.id}`);
                }}
              >
                <ThemedView style={styles.listingContainer}>
                  <ThemedView style={styles.imageWrapper}>
                    <Image
                      alt={item.title}
                      style={styles.image}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      source={{ uri: item.image }}
                    />
                    <View style={styles.matchBadge} pointerEvents="none">
                      <Ionicons name="swap-horizontal" size={18} color="#5BA3FF" />
                    </View>
                    <Pressable
                      style={styles.likeButton}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        if (isMyListing(item.id)) {
                          Alert.alert('', 'This is your posted product.');
                          return;
                        }
                        toggleLike(item.id);
                      }}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={isLiked(item.id) ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isLiked(item.id) ? '#FF3B30' : '#FFFFFF'}
                      />
                    </Pressable>
                  </ThemedView>
                  <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ flexShrink: 1, color: '#fff' }}>{item.title}</ThemedText>
                  <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}</ThemedText>
                </ThemedView>
              </Pressable>
            ))}
        </ThemedView>
      </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  listingContainer: {
    padding: 12,
    flex: 1,
    borderRadius: 8,
    backgroundColor: "#25282B",
  },

  listingLink: {
    flexBasis: '48%',
    maxWidth: '48%',
    textDecorationLine: 'none',
    marginBottom: 16,
    overflow: 'hidden'
  },

  image: {
    width: '100%',
    borderRadius: 8,
    aspectRatio: 1
  },

  imageWrapper: {
    position: 'relative',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pendingStampWrap: {
    position: 'absolute',
    top: 4,
    left: 4,
    zIndex: 2,
    maxWidth: '55%',
  },
  pendingStampRect: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
  },
  pendingStampText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.45,
  },
  likeButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  matchBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  flexbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 64
  },

  pressed: {
    opacity: 0.85
  },
  searchContainer: {
    paddingHorizontal: 0,
    paddingVertical: 16,
    backgroundColor: 'transparent'
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DarkTheme.colors.text,
    opacity: 0.95,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 6,
    borderColor: DarkTheme.colors.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },

  categoryIconWrap: {
    marginRight: 8,
    padding: 4,
  },
  searchInput: {
    flex: 1,
    padding: 0,
    margin: 0,
    color: '#111',
  },
  searchIconRight: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  categoryModalContent: {
    backgroundColor: DarkTheme.colors.card,
    borderRadius: 12,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  categoryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.colors.border,
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.colors.border,
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#fff',
  },
});
