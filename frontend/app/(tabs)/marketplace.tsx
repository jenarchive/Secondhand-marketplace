import { Image } from 'expo-image';
import { Platform, StyleSheet, Pressable, TextInput, View } from 'react-native';
import { useState, useMemo } from 'react';
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

export default function HomeScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();
  const { toggleLike, isLiked } = useLikedItems();
  const { items } = useMyListings();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i =>
      i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q)
    );
  }, [query, items]);

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#191C1F' }}
      headerImage={<Image />}>
      <ThemedView>
        {/* Search bar (Apple-native like) */}
        <View style={[styles.searchContainer, { paddingTop: insets.top + 8 }]}> 
          <View style={styles.searchInner}>
            <Ionicons name="search" size={18} color="#888" style={styles.searchIcon} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search items, categories or descriptions"
              placeholderTextColor="#888"
              style={styles.searchInput}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
        </View>
        <ThemedView style={styles.flexbox}>
            {filtered.map((item) => (
              <Pressable
                key={item.id}
                style={({ pressed }) => [styles.listingLink, pressed && styles.pressed]}
                onPress={async () => {
                  // light selection haptic and navigate
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push(`/items/${item.id}`);
                }}
                onLongPress={async () => {
                  // stronger feedback on long press
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
                    <Pressable
                      style={styles.likeButton}
                      onPress={(e) => {
                        e.stopPropagation?.();
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

  //each item is 48% width 2 items per row
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

  //wraps children into two columns
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
    //iOS-like shadow
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },

  searchIcon: {
    marginRight: 8
  },

  searchInput: {
    flex: 1,
    padding: 0,
    margin: 0,
    color: '#111'
  }
});
