import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMyListings } from '@/contexts/MyListingsContext';
import { setAcceptedOfferItemPrice, setOfferForItem, getAcceptedOfferItemPrice } from '@/store/transactionStore';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

export default function ChatTransactionScreen() {
  const params = useLocalSearchParams<{ id: string; sellerName?: string; transactionMethod?: string; offerPrice?: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const { items } = useMyListings();
  const itemData = items.find((item) => item.id === id);

  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const unselectedTextColor = colorScheme === 'dark' ? '#999' : '#666';
  const borderColor = colorScheme === 'dark' ? '#5BA3FF' : '#2563EB';
  const inputBarBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const headerTitle = params.sellerName ?? `User${id}`;

  const parsedOffer = Number(params.offerPrice);
  const hasOffer = Number.isFinite(parsedOffer) && parsedOffer > 0;
  const [message, setMessage] = useState('');
  const [offerAccepted, setOfferAccepted] = useState(() => {
    const stored = getAcceptedOfferItemPrice(id);
    return stored !== undefined && hasOffer && stored === parsedOffer;
  });

  if (!itemData) {
    return (
      <View style={[styles.screen, styles.center, { backgroundColor }]}>
        <Text style={{ color: '#fff' }}>Item not found.</Text>
      </View>
    );
  }

  const handleAcceptOffer = () => {
    if (!hasOffer || offerAccepted) return;
    setAcceptedOfferItemPrice(id, parsedOffer);
    setOfferForItem(id, String(parsedOffer));
    setOfferAccepted(true);
    router.replace({
      pathname: '/items/transaction/offer-accepted/[id]',
      params: { id: String(id) },
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    Alert.alert('Message sent', 'Demo chat message sent.');
    setMessage('');
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { backgroundColor }]}>
        <View style={[styles.header, { backgroundColor }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: BACK_BUTTON_BG }]}
            onPress={() => router.push(`/items/transaction/${id}` as any)}
            hitSlop={10}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]} numberOfLines={1}>
            {headerTitle}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={styles.productRow}>
            <Image source={{ uri: itemData.image }} style={styles.productImage} placeholder={{ blurhash }} contentFit="cover" />
            <View style={styles.productBody}>
              <Text style={[styles.productTitle, { color: '#FFFFFF' }]} numberOfLines={1}>
                {itemData.title}
              </Text>
              <Text style={[styles.productPrice, { color: '#FFFFFF' }]}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(itemData.price)}
              </Text>
              {params.transactionMethod === 'Delivery' && (
                <Text style={[styles.productPostage, { color: unselectedTextColor }]}>Postage 2.50</Text>
              )}
            </View>
          </View>

          <Pressable
            style={[styles.viewDetailsButton, { backgroundColor: borderColor }]}
            onPress={() => router.push({ pathname: '/items/[id]', params: { id: String(id), fromChat: 'true' } })}
          >
            <Text style={styles.viewDetailsButtonText}>View details</Text>
          </Pressable>

          {hasOffer && (
            <>
              <View style={[styles.offerCard, { backgroundColor: inputBarBg }]}>
                <Text style={styles.offerCardTitle}>(Username) has made an offer.</Text>
                <Text style={styles.offerCardBody}>
                  {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(parsedOffer)}
                </Text>
                <Pressable
                  style={[styles.acceptOfferButton, offerAccepted && styles.acceptOfferButtonDisabled]}
                  onPress={handleAcceptOffer}
                  disabled={offerAccepted}
                >
                  <Text style={[styles.acceptOfferButtonText, offerAccepted && styles.acceptOfferButtonTextDisabled]}>
                    {offerAccepted ? 'Accepted' : 'Accept offer'}
                  </Text>
                </Pressable>
              </View>

              {offerAccepted && (
                <View style={[styles.offerAcceptedCard, { backgroundColor: inputBarBg }]}>
                  <Text style={styles.offerAcceptedCardTitle}>Offer accepted</Text>
                  <Text style={styles.offerAcceptedCardBody}>
                    This offer has been accepted. You can continue in your transaction.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <View style={[styles.inputBar, { backgroundColor: inputBarBg }]}>
          <Pressable style={[styles.moreButton, { backgroundColor: BACK_BUTTON_BG }]}>
            <Ionicons name="add" size={22} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </Pressable>
          <TextInput
            style={[styles.messageInput, { color: '#FFFFFF' }]}
            placeholder="Enter your message."
            placeholderTextColor={unselectedTextColor}
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <Pressable
            style={[styles.sendButton, { backgroundColor: message.trim() ? borderColor : BACK_BUTTON_BG }]}
            onPress={handleSendMessage}
          >
            <Ionicons name="arrow-up" size={20} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    pointerEvents: 'none',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 0,
    padding: 4,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingTop: 112,
    paddingHorizontal: 20,
  },
  productRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  productImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  productBody: {
    flex: 1,
    minWidth: 0,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  productPostage: {
    fontSize: 13,
  },
  viewDetailsButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  viewDetailsButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  offerCard: {
    alignSelf: 'flex-end',
    width: 156,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    gap: 10,
  },
  offerCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FACC15',
    lineHeight: 18,
  },
  offerCardBody: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  acceptOfferButton: {
    alignSelf: 'stretch',
    backgroundColor: '#C44536',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 2,
  },
  acceptOfferButtonDisabled: {
    backgroundColor: '#000000',
  },
  acceptOfferButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  acceptOfferButtonTextDisabled: {
    color: '#888888',
  },
  offerAcceptedCard: {
    alignSelf: 'flex-end',
    maxWidth: '92%',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 2,
    gap: 6,
  },
  offerAcceptedCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FACC15',
    lineHeight: 18,
  },
  offerAcceptedCardBody: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: '#FFFFFF',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontSize: 15,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
