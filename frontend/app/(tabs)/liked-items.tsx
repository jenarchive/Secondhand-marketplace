import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export default function LikedItemsScreen() {
  const items = [
    { id: 1, name: 'Product Name 1', price: '35.00', sold: true },
    { id: 2, name: 'Product Name 2', price: '12.00', sold: false },
    { id: 3, name: 'Product Name 3', price: '48.00', sold: false },
  ];

  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const item of items) {
      initial[String(item.id)] = true;
    }
    return initial;
  });

  const toggleLike = (id: string | number) => {
    const key = String(id);
    setLikedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Match React Navigation DarkTheme card/header so one seamless color (light mode later)
  const screenBg = '#121212';
  const textColor = Colors.dark.text;
  const placeholderBg = '#2c2c2e';
  const soldBg = '#333333';

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: "Liked Items",
          headerBackVisible: false,
          headerShadowVisible: false,
          headerStyle: { backgroundColor: screenBg },
          headerTintColor: textColor,
        }} 
      />

      <ScrollView
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="never"
        style={{ backgroundColor: screenBg }}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item, index) => (
          <View key={item.id} style={[styles.card, index === 0 && styles.firstCard]}>
            {(() => {
              const key = String(item.id);
              const isLiked = likedMap[key];
              return (
            <View style={styles.imageWrapper}>
              <View style={[styles.imagePlaceholder, { backgroundColor: placeholderBg }]} />
              <Pressable
                style={styles.likeButton}
                onPress={() => toggleLike(item.id)}
                hitSlop={8}
              >
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isLiked ? '#FF3B30' : '#FFFFFF'}
                />
              </Pressable>
            </View>
              );
            })()}
            <View style={styles.infoContainer}>
              <ThemedText style={[styles.productName, { color: textColor }]}>{item.name}</ThemedText>
              <View style={styles.priceRow}>
                {item.sold && (
                  <View style={[styles.soldBadge, { backgroundColor: soldBg }]}>
                    <ThemedText style={styles.soldText}>SOLD</ThemedText>
                  </View>
                )}
                <ThemedText style={[styles.price, { color: textColor }]}>£{item.price}</ThemedText>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
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
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soldBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  soldText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
