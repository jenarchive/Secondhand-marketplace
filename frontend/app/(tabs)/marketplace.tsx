import { Image } from 'expo-image';
import { Alert, StyleSheet, Pressable, TextInput, View, Modal, FlatList, TouchableOpacity } from 'react-native';
import { useState, useMemo, useEffect, useSyncExternalStore } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { useMyListings } from '@/contexts/MyListingsContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CATEGORIES } from '@/constants/categories';
import {
  subscribePendingMeetup,
  getPendingMeetupVersion,
} from '@/store/pendingMeetupStore';

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { toggleLike, isLiked } = useLikedItems();
  const { items: contextItems, isMyListing } = useMyListings();
  const [displayItems, setDisplayItems] = useState<typeof contextItems>([]);
  const cardBg = colorScheme === 'dark' ? '#25282B' : 'rgba(0,0,0,0.12)';
  const primaryTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#111827';
  const iconColor = colorScheme === 'dark' ? '#888' : '#6B7280';
  const searchBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const searchTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#111827';
  const modalCardBg = colorScheme === 'dark' ? '#1F2937' : '#FFFFFF';
  const modalBorderColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)';

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
          <View style={[styles.searchInner, { backgroundColor: searchBg }]}>
            <Pressable
              onPress={() => setCategoryModalVisible(true)}
              hitSlop={8}
              style={styles.categoryIconWrap}
            >
              <Ionicons name="pricetag-outline" size={20} color={iconColor} />
            </Pressable>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search items, categories or descriptions"
              placeholderTextColor={iconColor}
              style={[styles.searchInput, { color: searchTextColor }]}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            <Ionicons name="search" size={18} color={iconColor} style={styles.searchIconRight} />
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
            <View style={[styles.categoryModalContent, { backgroundColor: modalCardBg }]}>
              <View style={[styles.categoryModalHeader, { borderBottomColor: modalBorderColor }]}>
                <ThemedText type="subtitle">Select category</ThemedText>
                <Pressable onPress={() => setCategoryModalVisible(false)} hitSlop={12}>
                  <Ionicons name="close" size={24} color={iconColor} />
                </Pressable>
              </View>
              <Pressable
                onPress={() => { setSelectedCategory(null); setCategoryModalVisible(false); }}
                style={[styles.categoryOption, { borderBottomColor: modalBorderColor }]}
              >
                <ThemedText style={[styles.categoryOptionText, { color: primaryTextColor }]}>All</ThemedText>
                {!selectedCategory && <Ionicons name="checkmark" size={20} color="#0A84FF" />}
              </Pressable>
              <FlatList
                data={CATEGORIES}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[styles.categoryOption, { borderBottomColor: modalBorderColor }]}
                    onPress={() => {
                      setSelectedCategory(item.name);
                      setCategoryModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <ThemedText style={[styles.categoryOptionText, { color: primaryTextColor }]}>{item.name}</ThemedText>
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
                  router.push({
                    pathname: '/items/[id]',
                    params: {
                      id: String(item.id),
                      source: 'marketplace',
                    },
                  });
                }}
                onLongPress={async () => {
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  router.push({
                    pathname: '/items/[id]',
                    params: {
                      id: String(item.id),
                      source: 'marketplace',
                    },
                  });
                }}
              >
                <ThemedView style={[styles.listingContainer, { backgroundColor: cardBg }]}>
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
                      style={[
                        styles.likeButton,
                        { backgroundColor: colorScheme === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.25)' },
                      ]}
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
                  <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ flexShrink: 1, color: primaryTextColor }}>{item.title}</ThemedText>
                  <ThemedText type="defaultSemiBold" style={{ color: primaryTextColor }}>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}</ThemedText>
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
    backgroundColor: 'rgba(0,0,0,0.35)',
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
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    opacity: 1,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 12,
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
    borderWidth: 0,
    borderColor: 'transparent',
    overflow: 'hidden',
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
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  categoryOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#111827',
  },
});
