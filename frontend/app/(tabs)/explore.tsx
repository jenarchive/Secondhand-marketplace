import { Image } from 'expo-image';
import { View, StyleSheet, Dimensions, Pressable, Text } from 'react-native';
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
const CARD_TOP = Math.max(24, (SCREEN_HEIGHT - CARD_HEIGHT) / 2 - 60);

const ARROW_COLOR = '#5a5a5a';

type ButterflyInstance = { id: number; direction: 'left' | 'right' };

export default function TabTwoScreen() {
  const [visibleItems, setVisibleItems] = useState(TestData.items);
  const [butterflies, setButterflies] = useState<ButterflyInstance[]>([]);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [hintsVisible, setHintsVisible] = useState(true);

  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const spawnButterflies = (direction: 'left' | 'right') => {
    if (direction !== 'right') return;
    const baseId = Date.now();
    const count = 3 + Math.floor(Math.random() * 2);
    const newOnes: ButterflyInstance[] = Array.from({ length: count }, (_, i) => ({
      id: baseId + i,
      direction: direction,
    }));
    setButterflies((prev) => [...prev, ...newOnes]);
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

  const currentItemId = visibleItems.length > 0 ? String(visibleItems[visibleItems.length - 1].id) : null;
  const isLiked = currentItemId ? likedIds[currentItemId] ?? false : false;

  const toggleLike = () => {
    if (!currentItemId) return;
    setLikedIds(prev => ({ ...prev, [currentItemId]: !prev[currentItemId] }));
  };

  return (
    <View style={styles.screen}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Image />}
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
            </View>
            <ThemedView style={styles.cardTextWrapper}>
              <ThemedText style={styles.cardText}>{item.title}</ThemedText>
              <ThemedText style={styles.cardTextPrice}>
                {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
              </ThemedText>
            </ThemedView>
            {index === visibleItems.length - 1 && (
              <>
                <Pressable
                  style={({ pressed }) => [styles.hintsToggle, pressed && styles.hintsTogglePressed]}
                  onPress={() => setHintsVisible(v => !v)}
                >
                  <View style={styles.hintsToggleBtn}>
                    <Ionicons
                      name={hintsVisible ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={ARROW_COLOR}
                    />
                  </View>
                </Pressable>
                {hintsVisible && (
              <View style={styles.swipeHints} pointerEvents="none">
                <View style={styles.hintUp}>
                  <Ionicons name="arrow-up" size={28} color={ARROW_COLOR} />
                  <View style={styles.hintTextUp}>
                    <Text style={styles.hintText}>Swipe up</Text>
                    <Text style={styles.hintText}>to <Text style={styles.hintTextAccent}>buy</Text></Text>
                  </View>
                </View>
                <View style={styles.hintLeft}>
                  <View style={styles.arrowLeft}>
                    <Ionicons name="arrow-back" size={28} color={ARROW_COLOR} />
                  </View>
                  <View style={styles.hintTextLeft}>
                    <Text style={styles.hintText}>Swipe left</Text>
                    <Text style={styles.hintText}>to <Text style={[styles.hintTextAccent, styles.hintTextRed]}>skip</Text></Text>
                  </View>
                </View>
                <View style={styles.hintRight}>
                  <View style={styles.arrowRight}>
                    <Ionicons name="arrow-forward" size={28} color={ARROW_COLOR} />
                  </View>
                  <View style={styles.hintTextRight}>
                    <Text style={styles.hintText}>Swipe right</Text>
                    <Text style={styles.hintText}>to <Text style={[styles.hintTextAccent, styles.hintTextGreen]}>like</Text></Text>
                  </View>
                </View>
              </View>
                )}
              </>
            )}
          </ThemedView>
        ))}
      </ParallaxScrollView>

      {visibleItems.length > 0 && (
        <View style={styles.actionBar}>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, styles.actionSkip, pressed && styles.actionPressed]}
            onPress={handleCardDismiss}
          >
            <Ionicons name="close" size={26} color="#FF453A" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, styles.actionBtnBuy, styles.actionBuy, pressed && styles.actionPressed]}
            onPress={() => {}}
          >
            <Ionicons name="bag" size={32} color="#fff" />
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionBtn, styles.actionLike, pressed && styles.actionPressed]}
            onPress={toggleLike}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={26}
              color="#32D74B"
            />
          </Pressable>
        </View>
      )}

      <View style={styles.butterflyOverlay} pointerEvents="none">
        {butterflies.map((b, i) => (
          <Butterfly
            key={b.id}
            direction={b.direction}
            startY={CARD_TOP + CARD_HEIGHT - 120}
            onFinish={() => removeButterfly(b.id)}
            clusterIndex={i}
            duration={4200}
          />
        ))}
      </View>

      {visibleItems.length === 0 && (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyStateTitle}>No more items!</ThemedText>
          <ThemedText style={styles.emptyStateReset} onPress={resetCards}>
            Reset Items
          </ThemedText>
        </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
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
  hintsToggle: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    alignItems: 'center',
  },
  hintsToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintsTogglePressed: {
    opacity: 0.7,
  },
  swipeHints: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },
  hintUp: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: {
    marginBottom: 6,
  },
  arrowRight: {
    marginBottom: 6,
    alignItems: 'flex-end',
  },
  hintLeft: {
    position: 'absolute',
    left: 8,
    top: '42%',
    alignItems: 'flex-start',
  },
  hintRight: {
    position: 'absolute',
    right: 8,
    top: '42%',
    alignItems: 'flex-end',
  },
  hintTextUp: {
    alignItems: 'center',
    marginTop: 4,
  },
  hintTextLeft: {
    alignItems: 'flex-start',
  },
  hintTextRight: {
    alignItems: 'flex-end',
  },
  hintText: {
    fontSize: 11,
    color: ARROW_COLOR,
    fontWeight: '500',
  },
  hintTextAccent: {
    fontWeight: '700',
    color: '#0A84FF',
  },
  hintTextRed: {
    color: '#FF453A',
  },
  hintTextGreen: {
    color: '#32D74B',
  },
  emptyState: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    marginBottom: 12,
    color: '#fff',
  },
  emptyStateReset: {
    fontSize: 16,
    color: '#0a84ff',
  },
  butterflyOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  actionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: CARD_TOP + CARD_HEIGHT + 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionSkip: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: 'rgba(255, 69, 58, 0.7)',
  },
  actionBtnBuy: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  actionBuy: {
    backgroundColor: '#0A84FF',
  },
  actionLike: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: 'rgba(50, 215, 75, 0.7)',
  },
});
