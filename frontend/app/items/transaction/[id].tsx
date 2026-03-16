import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

type TransactionMethod = 'Delivery' | 'Collection';

export default function TransactionScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const titleColor = colorScheme === 'dark' ? '#5BA3FF' : '#0047AB';
  const backgroundColor = useThemeColor({}, 'background');
  const backButtonBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  const cardBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
  const borderColor = colorScheme === 'dark' ? '#5BA3FF' : '#0047AB';
  const unselectedTextColor = colorScheme === 'dark' ? '#999' : '#666';

  const [method, setMethod] = useState<TransactionMethod>('Delivery');

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { backgroundColor }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: backButtonBg }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: titleColor }]} numberOfLines={1}>
            Transaction
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Transaction Method</Text>
          <View style={styles.methodRow}>
            <Pressable
              style={[
                styles.methodCard,
                { backgroundColor: cardBg },
                method === 'Delivery' && { borderWidth: 2, borderColor },
              ]}
              onPress={() => setMethod('Delivery')}
            >
              <Ionicons
                name="bicycle-outline"
                size={24}
                color={method === 'Delivery' ? borderColor : (colorScheme === 'dark' ? '#999' : '#666')}
              />
              <Text style={[styles.methodLabel, { color: method === 'Delivery' ? borderColor : unselectedTextColor }, method === 'Delivery' && { fontWeight: '600' }]}>
                Delivery
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.methodCard,
                { backgroundColor: cardBg },
                method === 'Collection' && { borderWidth: 2, borderColor },
              ]}
              onPress={() => setMethod('Collection')}
            >
              <Ionicons
                name="storefront-outline"
                size={24}
                color={method === 'Collection' ? borderColor : (colorScheme === 'dark' ? '#999' : '#666')}
              />
              <Text style={[styles.methodLabel, { color: method === 'Collection' ? borderColor : unselectedTextColor }, method === 'Collection' && { fontWeight: '600' }]}>
                Collection
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    zIndex: 100,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    pointerEvents: 'none',
  },
  backButton: {
    padding: 4,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingTop: 100 + 16,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 12,
  },
  methodCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  methodLabel: {
    fontSize: 15,
  },
});
