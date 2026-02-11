import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';

export default function LikedItemsScreen() {
  const items = [
    { id: 1, name: 'Product Name 1', price: '35.00', sold: true },
    { id: 2, name: 'Product Name 2', price: '12.00', sold: false },
    { id: 3, name: 'Product Name 3', price: '48.00', sold: false },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          headerTitle: "",
          headerShadowVisible: false,
        }} 
      />

      <ScrollView 
        contentContainerStyle={styles.listContent}
        contentInsetAdjustmentBehavior="never"
      >
        {items.map((item, index) => (
          <View key={item.id} style={[styles.card, index === 0 && styles.firstCard]}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.infoContainer}>
              <Text style={styles.productName}>{item.name}</Text>
              <View style={styles.priceRow}>
                {item.sold && (
                  <View style={styles.soldBadge}>
                    <Text style={styles.soldText}>SOLD</Text>
                  </View>
                )}
                <Text style={styles.price}>£{item.price}</Text>
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
    backgroundColor: '#ffffff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 0,
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
    backgroundColor: '#f2f2f2',
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
    color: '#333333',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  soldBadge: {
    backgroundColor: '#333333',
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
    color: '#000000',
  },
});
