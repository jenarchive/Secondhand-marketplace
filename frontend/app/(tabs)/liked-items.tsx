import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TouchableOpacity, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import TestData from '@/test-data.json';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import * as Haptics from 'expo-haptics';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { Swipeable } from 'react-native-gesture-handler';

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
  const { likedMap, likedOrder, toggleLike, clearAllLikes, setLikedOrder } = useLikedItems();
  const [isEditMode, setIsEditMode] = useState(false);
  const [orderedItems, setOrderedItems] = useState<TestItem[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const likedItems = getOrderedLikedItems(likedMap, likedOrder);

  const likedIdsStr = likedItems.map((i) => i.id).join(',');
  useEffect(() => {
    setOrderedItems(likedItems);
  }, [likedIdsStr]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setIsEditMode(false);
      };
    }, [])
  );

  const handleUnlike = (itemId: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      toggleLike(itemId);
      timeoutRef.current = null;
    }, UNLIKE_DELAY_MS);
  };

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const screenBg = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const placeholderBg = useThemeColor({ light: '#e5e5e5', dark: '#2c2c2e' }, 'background');

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <Stack.Screen
        options={{
          title: 'Likes',
          headerShown: likedItems.length > 0,
          headerTitleStyle: { fontWeight: '700' },
          headerStyle: { backgroundColor: screenBg },
          headerShadowVisible: false,
          headerTintColor: textColor,
          headerLeft: isEditMode
            ? () => (
                <Pressable
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert(
                      'Clear all items',
                      'Remove all items from your liked list?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Clear all',
                          style: 'destructive',
                          onPress: () => {
                            clearAllLikes();
                            setIsEditMode(false);
                          },
                        },
                      ]
                    );
                  }}
                  style={({ pressed }) => [
                    { padding: 8, marginLeft: 8, opacity: pressed ? 0.7 : 1 },
                  ]}
                  hitSlop={8}
                >
                  <ThemedText style={[styles.clearAllText, { color: '#FF3B30' }]}>
                    Clear all
                  </ThemedText>
                </Pressable>
              )
            : undefined,
          headerRight: () => (
            <Pressable
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setIsEditMode((v) => !v);
              }}
              style={({ pressed }) => [
                { padding: 8, marginRight: 20, opacity: pressed ? 0.7 : 1 },
              ]}
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
        <View style={[styles.emptyStateCenter, { backgroundColor: screenBg }]}>
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
          contentContainerStyle={[styles.listContent, { paddingTop: 18 }]}
          style={{ backgroundColor: screenBg }}
          renderItem={({ item, drag, isActive, getIndex }) => (
            <ScaleDecorator>
              <Swipeable
                renderRightActions={() => (
                    <View style={styles.deleteAction}>
                      <Pressable
                        style={styles.deleteButton}
                        onPress={async () => {
                          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          handleUnlike(item.id);
                        }}
                      >
                        <ThemedText style={styles.deleteButtonText} numberOfLines={1}>
                          Delete
                        </ThemedText>
                      </Pressable>
                    </View>
                )}
                overshootRight={false}
                rightThreshold={45}
              >
                <TouchableOpacity
                  onLongPress={drag}
                  disabled={isActive}
                  activeOpacity={1}
                  delayLongPress={300}
                  style={[
                    styles.card,
                    getIndex() === 0 && styles.firstCard,
                    { opacity: isActive ? 0.9 : 1 },
                  ]}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.imageWrapper}>
                      <Image
                        source={{ uri: item.image }}
                        alt={item.title}
                        style={[styles.imagePlaceholder, { backgroundColor: placeholderBg }]}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                      />
                    </View>
                    <View style={styles.infoContainer}>
                      <ThemedText style={[styles.productName, { color: textColor }]} numberOfLines={1}>
                        {item.title}
                      </ThemedText>
                      <ThemedText style={[styles.price, { color: textColor }]}>
                        {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
                      </ThemedText>
                    </View>
                  </View>
                  <View style={styles.dragHandleRight}>
                    <Ionicons name="reorder-three" size={24} color={textColor} />
                  </View>
                </TouchableOpacity>
              </Swipeable>
            </ScaleDecorator>
          )}
        />
      ) : (
      <ScrollView
        contentContainerStyle={[styles.listContent, { paddingTop: 18 }]}
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.14)',
    paddingBottom: 16,
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
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
  dragHandleRight: {
    marginLeft: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.85,
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
    width: 90,
    alignSelf: 'stretch',
    marginBottom: 24,
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 12,
    minWidth: 90,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  clearAllText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
