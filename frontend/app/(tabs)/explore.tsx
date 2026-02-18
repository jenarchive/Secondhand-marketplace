import { Image } from 'expo-image';
import { View, StyleSheet, Animated, Button, Dimensions, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ParallaxScrollView from '@/components/parallax-scroll-view-horizontal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TestData from '@/test-data.json'
import { useState } from 'react';
import { Butterfly } from '@/components/butterfly';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_MARGIN = 32;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const CARD_HEIGHT = CARD_WIDTH * (16 / 9);
const CARD_LEFT = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const CARD_TOP = Math.max(48, (SCREEN_HEIGHT - CARD_HEIGHT) / 2 - 24);

type ButterflyInstance = { id: number; direction: 'left' | 'right' };

export default function TabTwoScreen() {
  const [visibleItems, setVisibleItems] = useState(TestData.items);
  const [butterflies, setButterflies] = useState<ButterflyInstance[]>([]);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string | number) => {
    const key = String(id);
    setLikedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const spawnButterfly = () => {
    const id = Date.now();
    setButterflies((prev) => [...prev, { id, direction: 'right' as const }]);
  };

  const spawnButterflies = (direction: 'left' | 'right') => {
    const baseId = Date.now();
    setButterflies((prev) => [
      ...prev,
      { id: baseId, direction },
      { id: baseId + 1, direction },
      { id: baseId + 2, direction },
    ]);
  };

  const removeButterfly = (id: number) => {
    setButterflies((prev) => prev.filter((b) => b.id !== id));
  };

  const handleCardDismiss = () => {
    setVisibleItems(prev => prev.slice(0, -1));
  };

  const resetCards = () => {
    setVisibleItems(TestData.items);
  };

  return (
    <View style={styles.screen}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Image/>}
        onCardDismiss={handleCardDismiss}
        onSwipeDirection={spawnButterflies}
      >
        {visibleItems.map((item, index) => (
          <ThemedView
            style={[styles.cardContainer, { zIndex: index + 1 }]}
            key={item.id}
            pointerEvents={index === visibleItems.length - 1 ? 'auto' : 'none'}
          >
            <View style={styles.imageWrapper}>
              <Image
                placeholder={{ blurhash }}
                alt={item.title}
                style={styles.cardImage}
                contentFit="cover"
                source={{ uri: item.image }}
              />
              <Pressable
                style={styles.likeButton}
                onPress={() => toggleLike(item.id)}
                hitSlop={8}
              >
                <Ionicons
                  name={likedMap[String(item.id)] ? 'heart' : 'heart-outline'}
                  size={28}
                  color={likedMap[String(item.id)] ? '#FF3B30' : '#FFFFFF'}
                />
              </Pressable>
            </View>
            <ThemedView style={styles.cardTextWrapper}>
              <ThemedText style={styles.cardText}>{item.title}</ThemedText>
              <ThemedText style={styles.cardTextPrice}>
                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
        <View style={styles.buttonRow}>
          <Button title="generate butterfly" onPress={spawnButterfly} />
        </View>
      </ParallaxScrollView>

      <View style={styles.butterflyOverlay} pointerEvents="none">
        {butterflies.map((b, i) => (
          <Butterfly
            key={b.id}
            direction={b.direction}
            onFinish={() => removeButterfly(b.id)}
            clusterIndex={i % 3}
          />
        ))}
      </View>

      {visibleItems.length === 0 && (
      <Animated.View style={{ alignItems: 'center', marginTop: 0}}>
        <ThemedText style={{ fontSize: 18, marginBottom: 12 }}>No more items!</ThemedText>
        <ThemedText 
          style={{ fontSize: 16, color: 'blue' }}
          onPress={resetCards}
        >
          Reset Items
        </ThemedText>
      </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#353636',
  },
  cardContainer: {
    position: 'absolute',
    left: CARD_LEFT,
    top: CARD_TOP,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  cardImage: {
    borderRadius: 16,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  likeButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  cardTextPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  cardTextWrapper: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: 6,
    borderRadius: 8,
  },
  buttonRow: {
    paddingVertical: 8,
    zIndex: 0,
  },
  butterflyOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});
