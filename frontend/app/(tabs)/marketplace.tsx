import { Image } from 'expo-image';
import { Platform, StyleSheet, Pressable, TextInput, View } from 'react-native';
import { useState, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import TestData from '@/test-data.json'
import { ThemedText } from '@/components/themed-text';
import { DarkTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const colourScheme = useColorScheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const insets = useSafeAreaInsets();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TestData.items;
    return TestData.items.filter(i =>
      i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || (i.category || '').toLowerCase().includes(q)
    );
  }, [query]);

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
                  {/* seller small profile (avatar, name, rating) */}
                  <ThemedView style={styles.sellerRow}>
                    <ThemedView style={styles.sellerAvatar}>
                      <ThemedText type="defaultSemiBold">U</ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.sellerRating}>
                      {Array.from({ length: 5 }).map((_, i) => {
                        const filled = i + 1 <= 4; // default 4-star on listings
                        return (
                          <ThemedText key={i} type="defaultSemiBold" style={{ color: filled ? '#FFD700' : '#666', marginHorizontal: 1 }}>
                            {filled ? '★' : '☆'}
                          </ThemedText>
                        );
                      })}
                    </ThemedView>
                  </ThemedView>
                  <Image
                    alt={item.title}
                    style={styles.image}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                    source={{ uri: item.image }}
                  />
                    <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ flexShrink: 1 }}>{item.title}</ThemedText>
                  
                    <ThemedText type="default" numberOfLines={2} style={{ flexShrink: 1 }}>
                      {item.description}
                    </ThemedText>
                  <ThemedText type="defaultSemiBold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(item.price)}</ThemedText>
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
    overflow: 'hidden'

  },

  //each item is 48% width → 2 items per row
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

  //wraps children into two columns
  flexbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    
  },

  descriptionText: {
    height: '25%',
    textOverflow: "ellipsis",
    overflow: "hidden"
  }
  ,
  pressed: {
    opacity: 0.85
  }
  ,
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'transparent'
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 10,
    borderWidth: 1,
    borderColor: DarkTheme.colors.border,
    // subtle iOS-like shadow
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
  ,
  sellerRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between'
  },
  sellerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sellerMeta: {
    flex: 1,
    minWidth: 0
    ,
    marginRight: 8
  },
  sellerRating: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center'
  }
});
