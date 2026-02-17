import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';

export default function LikedItemsScreen() {
  const items = [
    { id: 1, name: 'Product Name 1', price: '35.00', sold: true },
    { id: 2, name: 'Product Name 2', price: '12.00', sold: false },
    { id: 3, name: 'Product Name 3', price: '48.00', sold: false },
  ];

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
          headerTitle: "",
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
            <View style={[styles.imagePlaceholder, { backgroundColor: placeholderBg }]} />
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
  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 16,
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
