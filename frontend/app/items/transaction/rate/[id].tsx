import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMyListings } from '@/contexts/MyListingsContext';

export default function RateAfterPaymentScreen() {
  const params = useLocalSearchParams<{ id: string; fromMyChatsList?: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { items, updateItem } = useMyListings();
  const itemData = items.find((item) => item.id === id);
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const inputBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const placeholderColor = colorScheme === 'dark' ? '#888' : '#999';
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const sellerName = useMemo(() => `User${id}`, [id]);

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { backgroundColor }]}>
        <Text style={styles.headerTitle}>Rate seller</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Rate your transaction with {sellerName}
        </Text>
        {itemData && (
          <View style={styles.itemPreview}>
            <Image
              source={{ uri: itemData.image }}
              style={styles.itemImage}
              contentFit="cover"
            />
            <Text style={styles.itemTitle}>{itemData.title}</Text>
          </View>
        )}

        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Pressable key={value} onPress={() => setRating(value)} hitSlop={8}>
              <Ionicons
                name={value <= rating ? 'star' : 'star-outline'}
                size={34}
                color="#FACC15"
              />
            </Pressable>
          ))}
        </View>

        <View style={[styles.reviewInputWrap, { backgroundColor: inputBg }]}>
          <TextInput
            style={styles.reviewInput}
            placeholder="Leave a short review (optional)"
            placeholderTextColor={placeholderColor}
            value={review}
            onChangeText={setReview}
            multiline
            maxLength={300}
          />
        </View>

        <Pressable
          style={styles.submitButton}
          onPress={() => {
            if (Number.isFinite(id) && id > 0) {
              updateItem(id, { rating });
            }
            router.replace({
              pathname: '/items/transaction/rating-submitted/[id]',
              params: {
                id: String(id),
                rating: String(rating),
                fromMyChatsList: params.fromMyChatsList ?? 'false',
              },
            } as any);
          }}
        >
          <Text style={styles.submitButtonText}>Submit rating</Text>
        </Pressable>
      </View>
    </View>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 100,
    paddingHorizontal: 20,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: 120,
    paddingHorizontal: 20,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 15,
    color: '#D1D5DB',
  },
  itemPreview: {
    marginTop: 20,
    borderRadius: 16,
    backgroundColor: '#25282B',
    padding: 12,
    gap: 10,
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#1F2937',
  },
  itemTitle: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  starsRow: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  reviewInputWrap: {
    marginTop: 24,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  reviewInput: {
    minHeight: 108,
    color: '#FFFFFF',
    fontSize: 15,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 28,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#0A84FF',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
