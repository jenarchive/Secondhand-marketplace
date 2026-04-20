import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useMyListings } from '@/contexts/MyListingsContext';
import {
  getOfferForItem,
  setOfferForItem,
  getAcceptedOfferItemPrice,
  hasSentOfferForItem,
  markOfferSentForItem,
} from '@/store/transactionStore';
import { markItemPaidSold, markPendingMeetupReservation } from '@/store/pendingMeetupStore';

type TransactionMethod = 'Delivery' | 'Collection';
type PaymentMethod = 'card' | 'inPerson';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';
const DELIVERY_POSTAGE = 2.5;

export default function TransactionScreen() {
  const params = useLocalSearchParams<{ id: string; source?: string; fromMarketplace?: string; fromExplore?: string; fromLikedItems?: string }>();
  const id = Number(params.id);
  const sourceParam = params.source;
  const source = Array.isArray(sourceParam) ? sourceParam[0] : sourceParam;
  const fromMarketplaceParam = params.fromMarketplace;
  const fromExploreParam = params.fromExplore;
  const fromLikedItemsParam = params.fromLikedItems;
  const fromMarketplace = (Array.isArray(fromMarketplaceParam) ? fromMarketplaceParam[0] : fromMarketplaceParam) === 'true';
  const fromExplore = (Array.isArray(fromExploreParam) ? fromExploreParam[0] : fromExploreParam) === 'true';
  const fromLikedItems = (Array.isArray(fromLikedItemsParam) ? fromLikedItemsParam[0] : fromLikedItemsParam) === 'true';
  const router = useRouter();
  const { items } = useMyListings();
  const itemData = items.find((item) => item.id === id);
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const cardBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.12)';
  const borderColor = colorScheme === 'dark' ? '#5BA3FF' : '#0047AB';
  const unselectedTextColor = colorScheme === 'dark' ? '#999' : '#666';
  const primaryTextColor = colorScheme === 'dark' ? '#FFFFFF' : '#111827';

  const [method, setMethod] = useState<TransactionMethod>('Delivery');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  useEffect(() => {
    if (method === 'Delivery') {
      setPaymentMethod('card');
    } else {
      setPaymentMethod('inPerson');
    }
  }, [method]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [collectionLocation, setCollectionLocation] = useState('');
  const [offerPrice, setOfferPrice] = useState(() => getOfferForItem(id));
  const [acceptedItemPrice, setAcceptedItemPrice] = useState<number | undefined>(() => getAcceptedOfferItemPrice(id));
  const [hasMadeOffer, setHasMadeOffer] = useState(() => hasSentOfferForItem(id));
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      setAcceptedItemPrice(getAcceptedOfferItemPrice(id));
      setHasMadeOffer(hasSentOfferForItem(id));
    }, [id])
  );
  const inputBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)';
  const inputPlaceholderColor = colorScheme === 'dark' ? '#888' : '#999';

  const handleOfferPriceChange = (value: string) => {
    if (hasMadeOffer) {
      Alert.alert('Offer already sent', 'You already made an offer. You cannot change the adjusted price now.');
      return;
    }
    setOfferPrice(value);
    if (itemData) {
      setOfferForItem(id, value);
    }
  };

  const handleSendOffer = () => {
    const num = parseFloat(offerPrice.replace(/[^0-9.]/g, ''));
    if (!itemData) return;
    if (hasMadeOffer) {
      Alert.alert('Offer already sent', 'You already made an offer for this item.');
      return;
    }
    if (!offerPrice.trim() || isNaN(num) || num <= 0) {
      Alert.alert('Enter your offer', 'Please enter a price for your offer.');
      return;
    }
    if (num === itemData.price) {
      Alert.alert('Same as list price', 'Your offer is the same as the list price. Please enter a different amount.');
      return;
    }
    markOfferSentForItem(id);
    setHasMadeOffer(true);
    router.push({
      pathname: '/items/transaction/offer-sent/[id]',
      params: {
        id: String(id),
        offerPrice: String(num),
        transactionMethod: method,
        ...(source ? { source } : {}),
        fromMarketplace: (source === 'marketplace' || fromMarketplace) ? 'true' : 'false',
        fromExplore: (source === 'explore' || fromExplore) ? 'true' : 'false',
        fromLikedItems: (source === 'liked-items' || fromLikedItems) ? 'true' : 'false',
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
        ...(source ? { source } : {}),
        fromMarketplace: (source === 'marketplace' || fromMarketplace) ? 'true' : 'false',
        fromExplore: (source === 'explore' || fromExplore) ? 'true' : 'false',
        fromLikedItems: (source === 'liked-items' || fromLikedItems) ? 'true' : 'false',
        offerPrice:
          acceptedItemPrice !== undefined
            ? String(acceptedItemPrice)
            : hasValidOffer
              ? String(num)
              : undefined,
      },
    });
  };

  const handlePayOrReserve = () => {
    if (method === 'Collection' && paymentMethod === 'inPerson') {
      markPendingMeetupReservation(id);
      router.replace('/(tabs)');
      return;
    }
    if (paymentMethod === 'card') {
      markItemPaidSold(id);
      router.push(`/items/transaction/rate/${id}` as any);
    }
  };

  const paymentItemPrice = itemData && (acceptedItemPrice ?? itemData.price);
  const isOfferAccepted = acceptedItemPrice !== undefined;

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
            onPress={() => {
              if (source === 'marketplace' || fromMarketplace) {
                router.replace('/(tabs)');
                return;
              }
              if (source === 'explore' || fromExplore) {
                router.replace('/(tabs)/explore');
                return;
              }
              if (source === 'liked-items' || fromLikedItems) {
                router.replace('/(tabs)/liked-items');
                return;
              }
              router.replace(`/items/${id}`);
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: primaryTextColor }]} numberOfLines={1}>
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
          <Text style={[styles.sectionLabel, { color: primaryTextColor }]}>Transaction method</Text>
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
              <Text style={[styles.sectionLabel, { color: primaryTextColor }]}>Delivery address</Text>
              <View style={[styles.addressInputWrap, { backgroundColor: inputBg }]}>
                <TextInput
                  style={[styles.addressInput, { color: primaryTextColor }]}
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
              <Text style={[styles.sectionLabel, { color: primaryTextColor }]}>Meet-up location</Text>
              <View style={[styles.addressInputWrap, { backgroundColor: inputBg }]}>
                <TextInput
                  style={[styles.addressInput, { color: primaryTextColor }]}
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
              <Text style={[styles.sectionLabel, styles.orderSectionLabel, { color: primaryTextColor }]}>Ordered product</Text>
              <Pressable
                style={[styles.orderCard, { backgroundColor: cardBg }]}
                onPress={() =>
                  router.push({
                    pathname: '/items/[id]',
                    params: {
                      id: String(id),
                      ...(source ? { source } : {}),
                      fromTransaction: 'true',
                    },
                  })
                }
              >
                <Image
                  source={{ uri: itemData.image }}
                  style={styles.orderCardImage}
                  placeholder={{ blurhash }}
                  contentFit="cover"
                />
                <View style={styles.orderCardBody}>
                  <Text style={[styles.orderPrice, { color: primaryTextColor }]} numberOfLines={1}>
                    {itemData.title}
                  </Text>
                  <Text style={[styles.orderDescription, { color: unselectedTextColor }]} numberOfLines={2}>
                    {itemData.description}
                  </Text>
                </View>
              </Pressable>

              <View style={styles.actionSection}>
                <Text style={[styles.sectionLabel, { color: primaryTextColor }]}>Adjust price</Text>
                <View style={styles.offerRow}>
                  <Text style={[styles.listPriceLabel, { color: unselectedTextColor }]}>
                    List price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(itemData.price)}
                  </Text>
                  <View style={[styles.offerInputWrap, { backgroundColor: inputBg }]}>
                    <Text style={[styles.currencyPrefix, { color: unselectedTextColor }]}>£</Text>
                    <TextInput
                      style={[styles.offerInput, { color: primaryTextColor }]}
                      placeholder="Your offer"
                      placeholderTextColor={inputPlaceholderColor}
                      value={offerPrice}
                      onChangeText={handleOfferPriceChange}
                      editable={!hasMadeOffer}
                      onPressIn={() => {
                        if (hasMadeOffer) {
                          Alert.alert('Offer already sent', 'You already made an offer. You cannot change the adjusted price now.');
                        }
                      }}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  {!isOfferAccepted && !hasMadeOffer && (
                    <Pressable
                      style={[styles.offerButton, { backgroundColor: borderColor }]}
                      onPress={handleSendOffer}
                    >
                      <Text style={styles.offerButtonText}>Send offer</Text>
                    </Pressable>
                  )}
                </View>
              </View>

              <Pressable
                style={[
                  styles.chatButton,
                  (isOfferAccepted || hasMadeOffer)
                    ? { backgroundColor: borderColor, borderWidth: 0 }
                    : { backgroundColor: cardBg, borderWidth: 1, borderColor },
                ]}
                onPress={handleChatWithSeller}
              >
                <Ionicons
                  name="chatbubble-outline"
                  size={22}
                  color={(isOfferAccepted || hasMadeOffer) ? '#FFFFFF' : borderColor}
                />
                <Text
                  style={[
                    styles.chatButtonText,
                    { color: (isOfferAccepted || hasMadeOffer) ? '#FFFFFF' : borderColor },
                  ]}
                >
                  Chat with seller
                </Text>
              </Pressable>

              <View style={styles.paymentMethodSection}>
                <Text style={[styles.sectionLabel, { color: primaryTextColor }]}>Payment method</Text>
                <View style={styles.methodRow}>
                  <Pressable
                    disabled={method === 'Collection'}
                    style={[
                      styles.methodCard,
                      { backgroundColor: cardBg },
                      paymentMethod === 'card' && { borderWidth: 2, borderColor },
                      method === 'Collection' && styles.paymentMethodDisabled,
                    ]}
                    onPress={() => setPaymentMethod('card')}
                  >
                    <Ionicons
                      name="card-outline"
                      size={24}
                      color={
                        method === 'Collection'
                          ? (colorScheme === 'dark' ? '#666' : '#999')
                          : paymentMethod === 'card'
                            ? borderColor
                            : (colorScheme === 'dark' ? '#999' : '#666')
                      }
                    />
                    <Text
                      style={[
                        styles.methodLabel,
                        {
                          color:
                            method === 'Collection'
                              ? (colorScheme === 'dark' ? '#666' : '#999')
                              : paymentMethod === 'card'
                                ? borderColor
                                : unselectedTextColor,
                        },
                        paymentMethod === 'card' && method !== 'Collection' && { fontWeight: '600' },
                      ]}
                    >
                      Card
                    </Text>
                  </Pressable>
                  <Pressable
                    disabled={method === 'Delivery'}
                    style={[
                      styles.methodCard,
                      { backgroundColor: cardBg },
                      paymentMethod === 'inPerson' && { borderWidth: 2, borderColor },
                      method === 'Delivery' && styles.paymentMethodDisabled,
                    ]}
                    onPress={() => setPaymentMethod('inPerson')}
                  >
                    <Ionicons
                      name="wallet-outline"
                      size={24}
                      color={
                        method === 'Delivery'
                          ? (colorScheme === 'dark' ? '#666' : '#999')
                          : paymentMethod === 'inPerson'
                            ? borderColor
                            : (colorScheme === 'dark' ? '#999' : '#666')
                      }
                    />
                    <Text
                      style={[
                        styles.methodLabel,
                        {
                          color:
                            method === 'Delivery'
                              ? (colorScheme === 'dark' ? '#666' : '#999')
                              : paymentMethod === 'inPerson'
                                ? borderColor
                                : unselectedTextColor,
                        },
                        paymentMethod === 'inPerson' && method !== 'Delivery' && { fontWeight: '600' },
                      ]}
                    >
                      Pay in-person
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.totalSection}>
                <Text style={[styles.sectionLabel, { color: primaryTextColor }]}>Payment amount</Text>
                <Text style={[styles.totalHelperText, { color: unselectedTextColor }]}>
                  The price will update once the seller agrees
                </Text>
                <View style={[styles.totalCard, { backgroundColor: cardBg }]}>
                  <View style={[styles.totalCardRow, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
                    <Text style={[styles.totalCardLabel, { color: unselectedTextColor }]}>Item price</Text>
                    <Text style={[styles.totalCardAmount, { color: primaryTextColor }]}>
                      {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(paymentItemPrice ?? itemData.price)}
                    </Text>
                  </View>
                  <View style={[styles.totalCardRow, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
                    <Text style={[styles.totalCardLabel, { color: unselectedTextColor }]}>Delivery fee</Text>
                    <Text style={[styles.totalCardAmount, { color: primaryTextColor }]}>
                      {method === 'Delivery'
                        ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(DELIVERY_POSTAGE)
                        : 'Free'}
                    </Text>
                  </View>
                  <View style={[styles.totalCardRow, { borderBottomColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }]}>
                    <Text style={[styles.totalCardLabel, { color: unselectedTextColor }]}>Service fee</Text>
                    <Text style={[styles.totalCardAmount, { color: primaryTextColor }]}>Free</Text>
                  </View>
                  <View style={styles.totalCardRowLast}>
                    <Text style={[styles.totalCardTotalLabel, { color: primaryTextColor }]}>Total payment</Text>
                    <Text style={[styles.totalCardTotalAmount, { color: primaryTextColor }]}>
                      {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(
                        method === 'Delivery'
                          ? (paymentItemPrice ?? itemData.price) + DELIVERY_POSTAGE
                          : (paymentItemPrice ?? itemData.price)
                      )}
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                style={[styles.payButton, { backgroundColor: borderColor }]}
                onPress={handlePayOrReserve}
              >
                <Text style={styles.payButtonText}>
                  {paymentMethod === 'inPerson' ? 'Reserve item' : 'Pay now'}
                </Text>
              </Pressable>
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
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
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
  paymentMethodDisabled: {
    opacity: 0.45,
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
  totalHelperText: {
    fontSize: 13,
    marginTop: 2,
    marginBottom: 2,
  },
  payButton: {
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionSection: {
    marginTop: 20,
  },
  offerRow: {
    gap: 10,
    marginTop: 4,
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
  },
  chatButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
