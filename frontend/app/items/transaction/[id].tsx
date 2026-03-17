import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useMyListings } from '@/contexts/MyListingsContext';
import { getOfferForItem, setOfferForItem } from '@/store/transactionStore';

type TransactionMethod = 'Delivery' | 'Collection';
type PaymentMethod = 'card' | 'inPerson';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';
const DELIVERY_POSTAGE = 2.5;

export default function TransactionScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { items } = useMyListings();
  const itemData = items.find((item) => item.id === id);
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const cardBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
  const borderColor = colorScheme === 'dark' ? '#5BA3FF' : '#0047AB';
  const unselectedTextColor = colorScheme === 'dark' ? '#999' : '#666';

  const [method, setMethod] = useState<TransactionMethod>('Delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [collectionLocation, setCollectionLocation] = useState('');
  const [offerPrice, setOfferPrice] = useState(() => getOfferForItem(id));
  const insets = useSafeAreaInsets();
  const inputBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const inputPlaceholderColor = colorScheme === 'dark' ? '#888' : '#999';

  const handleOfferPriceChange = (value: string) => {
    setOfferPrice(value);
    if (itemData) {
      setOfferForItem(id, value);
    }
  };

  const handleSendOffer = () => {
    const num = parseFloat(offerPrice.replace(/[^0-9.]/g, ''));
    if (!itemData) return;
    if (!offerPrice.trim() || isNaN(num) || num <= 0) {
      Alert.alert('Enter your offer', 'Please enter a price for your offer.');
      return;
    }
    if (num === itemData.price) {
      Alert.alert('Same as list price', 'Your offer is the same as the list price. Please enter a different amount.');
      return;
    }
    router.push({
      pathname: '/items/transaction/offer-sent/[id]',
      params: {
        id: String(id),
        offerPrice: String(num),
        transactionMethod: method,
      },
    });
  };

  const handleChatWithSeller = () => {
    const num = parseFloat(offerPrice.replace(/[^0-9.]/g, ''));
    const hasValidOffer = !isNaN(num) && num > 0;

    router.push({
      pathname: '/items/chat/[id]',
      params: {
        id: String(id),
        sellerName: `User${id}`,
        transactionMethod: method,
        offerPrice: hasValidOffer ? String(num) : undefined,
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={[styles.screen, { backgroundColor }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={[styles.header, { backgroundColor }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: BACK_BUTTON_BG }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]} numberOfLines={1}>
            Transaction
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.content, { paddingBottom: 24 + Math.max(insets.bottom, 12) }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Transaction method</Text>
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
                name="cube-outline"
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
                name="people-outline"
                size={24}
                color={method === 'Collection' ? borderColor : (colorScheme === 'dark' ? '#999' : '#666')}
              />
              <Text style={[styles.methodLabel, { color: method === 'Collection' ? borderColor : unselectedTextColor }, method === 'Collection' && { fontWeight: '600' }]}>
                Meet-up
              </Text>
            </Pressable>
          </View>

          {method === 'Delivery' && (
            <View style={styles.addressSection}>
              <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Delivery address</Text>
              <View style={[styles.addressInputWrap, { backgroundColor: inputBg }]}>
                <TextInput
                  style={[styles.addressInput, { color: '#FFFFFF' }]}
                  placeholder="Enter postcode"
                  placeholderTextColor={inputPlaceholderColor}
                  value={deliveryAddress}
                  onChangeText={setDeliveryAddress}
                />
                <Ionicons name="search-outline" size={22} color={inputPlaceholderColor} style={styles.addressInputIcon} />
              </View>
            </View>
          )}

          {method === 'Collection' && (
            <View style={styles.addressSection}>
              <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Meet-up location</Text>
              <View style={[styles.addressInputWrap, { backgroundColor: inputBg }]}>
                <TextInput
                  style={[styles.addressInput, { color: '#FFFFFF' }]}
                  placeholder="e.g. Station, cafe name"
                  placeholderTextColor={inputPlaceholderColor}
                  value={collectionLocation}
                  onChangeText={setCollectionLocation}
                />
                <Ionicons name="location-outline" size={22} color={inputPlaceholderColor} style={styles.addressInputIcon} />
              </View>
            </View>
          )}

          {itemData && (
            <View style={styles.orderSection}>
              <Text style={[styles.sectionLabel, styles.orderSectionLabel, { color: '#FFFFFF' }]}>Ordered product</Text>
              <Pressable
                style={[styles.orderCard, { backgroundColor: cardBg }]}
                onPress={() => router.push(`/items/${id}`)}
              >
                <Image
                  source={{ uri: itemData.image }}
                  style={styles.orderCardImage}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                />
                <View style={styles.orderCardBody}>
                  <Text style={[styles.orderPrice, { color: '#FFFFFF' }]} numberOfLines={1}>
                    {itemData.title}
                  </Text>
                  <Text style={[styles.orderDescription, { color: unselectedTextColor }]} numberOfLines={2}>
                    {itemData.description}
                  </Text>
                </View>
              </Pressable>

              <View style={styles.actionSection}>
                <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Adjust price</Text>
                <View style={styles.offerRow}>
                  <Text style={[styles.listPriceLabel, { color: unselectedTextColor }]}>
                    List price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(itemData.price)}
                  </Text>
                  <View style={[styles.offerInputWrap, { backgroundColor: inputBg }]}>
                    <Text style={[styles.currencyPrefix, { color: unselectedTextColor }]}>£</Text>
                    <TextInput
                      style={[styles.offerInput, { color: '#FFFFFF' }]}
                      placeholder="Your offer"
                      placeholderTextColor={inputPlaceholderColor}
                      value={offerPrice}
                      onChangeText={handleOfferPriceChange}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <Pressable
                    style={[styles.offerButton, { backgroundColor: borderColor }]}
                    onPress={handleSendOffer}
                  >
                    <Text style={styles.offerButtonText}>Send offer</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                style={[styles.chatButton, { backgroundColor: cardBg, borderColor: borderColor }]}
                onPress={handleChatWithSeller}
              >
                <Ionicons name="chatbubble-outline" size={22} color={borderColor} />
                <Text style={[styles.chatButtonText, { color: '#FFFFFF' }]}>Chat with seller</Text>
              </Pressable>

              <View style={styles.paymentMethodSection}>
                <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Payment method</Text>
                <View style={styles.methodRow}>
                  <Pressable
                    style={[
                      styles.methodCard,
                      { backgroundColor: cardBg },
                      paymentMethod === 'card' && { borderWidth: 2, borderColor },
                    ]}
                    onPress={() => setPaymentMethod('card')}
                  >
                    <Ionicons
                      name="card-outline"
                      size={24}
                      color={paymentMethod === 'card' ? borderColor : (colorScheme === 'dark' ? '#999' : '#666')}
                    />
                    <Text style={[styles.methodLabel, { color: paymentMethod === 'card' ? borderColor : unselectedTextColor }, paymentMethod === 'card' && { fontWeight: '600' }]}>
                      Card
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.methodCard,
                      { backgroundColor: cardBg },
                      paymentMethod === 'inPerson' && { borderWidth: 2, borderColor },
                    ]}
                    onPress={() => setPaymentMethod('inPerson')}
                  >
                    <Ionicons
                      name="wallet-outline"
                      size={24}
                      color={paymentMethod === 'inPerson' ? borderColor : (colorScheme === 'dark' ? '#999' : '#666')}
                    />
                    <Text style={[styles.methodLabel, { color: paymentMethod === 'inPerson' ? borderColor : unselectedTextColor }, paymentMethod === 'inPerson' && { fontWeight: '600' }]}>
                      Pay in-person
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.totalSection}>
                <Text style={[styles.sectionLabel, { color: '#FFFFFF' }]}>Payment amount</Text>
                <View style={[styles.totalCard, { backgroundColor: cardBg }]}>
                  <View style={[styles.totalCardRow, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
                    <Text style={[styles.totalCardLabel, { color: unselectedTextColor }]}>Item price</Text>
                    <Text style={[styles.totalCardAmount, { color: '#FFFFFF' }]}>
                      {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(itemData.price)}
                    </Text>
                  </View>
                  <View style={[styles.totalCardRow, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
                    <Text style={[styles.totalCardLabel, { color: unselectedTextColor }]}>Delivery fee</Text>
                    <Text style={[styles.totalCardAmount, { color: '#FFFFFF' }]}>
                      {method === 'Delivery'
                        ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(DELIVERY_POSTAGE)
                        : 'Free'}
                    </Text>
                  </View>
                  <View style={[styles.totalCardRow, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
                    <Text style={[styles.totalCardLabel, { color: unselectedTextColor }]}>Service fee</Text>
                    <Text style={[styles.totalCardAmount, { color: '#FFFFFF' }]}>Free</Text>
                  </View>
                  <View style={styles.totalCardRowLast}>
                    <Text style={[styles.totalCardTotalLabel, { color: '#FFFFFF' }]}>Total payment</Text>
                    <Text style={[styles.totalCardTotalAmount, { color: '#FFFFFF' }]}>
                      {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(method === 'Delivery' ? itemData.price + DELIVERY_POSTAGE : itemData.price)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
    marginTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
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
  addressSection: {
    marginTop: 24,
  },
  addressInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingRight: 12,
  },
  addressInput: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  addressInputIcon: {
    marginLeft: 4,
  },
  orderSection: {
    marginTop: 28,
  },
  orderSectionLabel: {
    marginBottom: 12,
  },
  orderCard: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    padding: 12,
    gap: 12,
  },
  orderCardImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  orderCardBody: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  orderPrice: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  paymentMethodSection: {
    marginTop: 24,
  },
  totalSection: {
    marginTop: 24,
  },
  totalCard: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 8,
  },
  totalCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  totalCardRowLast: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  totalCardLabel: {
    fontSize: 15,
  },
  totalCardAmount: {
    fontSize: 15,
  },
  totalCardTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalCardTotalAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionSection: {
    marginTop: 20,
  },
  offerRow: {
    gap: 10,
    marginTop: 8,
  },
  listPriceLabel: {
    fontSize: 13,
  },
  offerInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  currencyPrefix: {
    fontSize: 15,
    marginRight: 4,
  },
  offerInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
  },
  offerButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  offerButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    borderWidth: 1,
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
