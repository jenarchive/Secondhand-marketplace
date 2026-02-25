import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import TestData from '@/test-data.json';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import * as Haptics from 'expo-haptics';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const UNLIKE_DELAY_MS = 100;

type TestItem = (typeof TestData.items)[number];

function getOrderedLikedItems(
  likedMap: Record<string, boolean>,
  likedOrder: number[]
): TestItem[] {
  const defaultOrder = TestData.items.filter((i) => likedMap[String(i.id)]).map((i) => i.id);
  const orderedIds =
    likedOrder.length > 0
      ? [
          ...likedOrder.filter((id) => likedMap[String(id)]),
          ...defaultOrder.filter((id) => !likedOrder.includes(id)),
        ]
      : defaultOrder;
  return orderedIds
    .map((id) => TestData.items.find((i) => i.id === id))
    .filter((i): i is TestItem => !!i);
}

export default function LikedItemsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { likedMap, likedOrder, toggleLike, setLikedOrder, isLiked } = useLikedItems();
  const [pendingRemovalId, setPendingRemovalId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [orderedItems, setOrderedItems] = useState<TestItem[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const likedItems = getOrderedLikedItems(likedMap, likedOrder);

  const likedIdsStr = likedItems.map((i) => i.id).join(',');
  useEffect(() => {
    setOrderedItems(likedItems);
  }, [likedIdsStr]);

  const handleUnlike = (itemId: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setPendingRemovalId(itemId);
    timeoutRef.current = setTimeout(() => {
      toggleLike(itemId);
      setPendingRemovalId(null);
      timeoutRef.current = null;
    }, UNLIKE_DELAY_MS);
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const screenBg = '#121212';
  const textColor = Colors.dark.text;
  const placeholderBg = '#2c2c2e';

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <Stack.Screen
        options={{
          title: 'Liked Items',
          headerShown: likedItems.length > 0,
          headerTitleStyle: { fontWeight: '700' },
          headerStyle: { backgroundColor: screenBg },
          headerTintColor: textColor,
          headerRight: () => (
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsEditMode((v) => !v);
              }}
              style={({ pressed }) => [{ padding: 8, marginLeft: -24, opacity: pressed ? 0.7 : 1 }]}
              hitSlop={8}
            >
              <Ionicons
                name={isEditMode ? 'checkmark' : 'reorder-three'}
                size={28}
                color={textColor}
              />
            </Pressable>
          ),
        }}
      />

      {likedItems.length === 0 ? (
        <View style={styles.emptyStateCenter}>
          <View style={styles.emptyStateAbove}>
            <ThemedText style={[styles.emptyText, { color: textColor }]}>
              No liked items yet
            </ThemedText>
          </View>
          <View style={styles.emptyStateButtonAtCenter}>
            <Pressable
              style={({ pressed }) => [pressed && { opacity: 0.85 }]}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.replace('/(tabs)');
              }}
            >
              <ThemedView style={styles.marketplaceButton}>
                <ThemedText style={styles.marketplaceButtonText}>Go to Marketplace</ThemedText>
              </ThemedView>
            </Pressable>
          </View>
        </View>
      ) : isEditMode ? (
        <DraggableFlatList
          data={orderedItems}
          keyExtractor={(item) => String(item.id)}
          onDragEnd={({ data }) => {
            setOrderedItems(data);
            setLikedOrder(data.map((i) => i.id));
          }}
          contentContainerStyle={[styles.listContent, { paddingTop: 12 }]}
          style={{ backgroundColor: screenBg }}
          renderItem={({ item, drag, isActive, getIndex }) => (
            <ScaleDecorator>
              <Pressable
                onLongPress={drag}
                disabled={isActive}
                style={[
                  styles.card,
                  getIndex() === 0 && styles.firstCard,
                  { opacity: isActive ? 0.9 : 1 },
                ]}
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: item.image }}
                    alt={item.title}
                    style={[styles.imagePlaceholder, { backgroundColor: placeholderBg }]}
                    placeholder={{ blurhash }}
                    contentFit="cover"
                  />
                  <View style={styles.dragHandle}>
                    <Ionicons name="reorder-three" size={24} color={textColor} />
                  </View>
                </View>
                <View style={styles.infoContainer}>
                  <ThemedText style={[styles.productName, { color: textColor }]} numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={[styles.price, { color: textColor }]}>
                    {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
                  </ThemedText>
                </View>
              </Pressable>
            </ScaleDecorator>
          )}
        />
      ) : (
      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingTop: 12 }]}
        contentInsetAdjustmentBehavior="never"
        style={{ backgroundColor: screenBg }}
        showsVerticalScrollIndicator={false}
      >
        {likedItems.map((item, index) => (
            <Pressable
              key={item.id}
              style={[styles.card, index === 0 && styles.firstCard]}
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push(`/items/${item.id}`);
              }}
            >
              <View style={styles.imageWrapper}>
                <Image
                  source={{ uri: item.image }}
                  alt={item.title}
                  style={[styles.imagePlaceholder, { backgroundColor: placeholderBg }]}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                />
                <Pressable
                  style={styles.likeButton}
                  onPress={async (e) => {
                    e.stopPropagation?.();
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    handleUnlike(item.id);
                  }}
                  hitSlop={8}
                >
                  <Ionicons
                    name={pendingRemovalId === item.id ? 'heart-outline' : isLiked(item.id) ? 'heart' : 'heart-outline'}
                    size={20}
                    color={pendingRemovalId === item.id ? '#FFFFFF' : isLiked(item.id) ? '#FF3B30' : '#FFFFFF'}
                  />
                </Pressable>
              </View>
              <View style={styles.infoContainer}>
                <ThemedText style={[styles.productName, { color: textColor }]} numberOfLines={1}>
                  {item.title}
                </ThemedText>
                <ThemedText style={[styles.price, { color: textColor }]}>
                  {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
                </ThemedText>
              </View>
            </Pressable>
          ))}
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyStateCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: '#121212',
  },
  emptyStateAbove: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '50%',
    marginBottom: 52,
    alignItems: 'center',
  },
  emptyStateButtonAtCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    alignItems: 'center',
    transform: [{ translateY: -30 }],
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  marketplaceButton: {
    width: 300,
    height: 60,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28289D',
  },
  marketplaceButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  firstCard: {
    marginTop: 0,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 12,
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
  dragHandle: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
