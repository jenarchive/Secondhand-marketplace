import { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Pressable, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useMyListings } from '@/contexts/MyListingsContext';

type TransactionMethod = 'Delivery' | 'Collection';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function TransactionScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Number(params.id);
  const router = useRouter();
  const { items } = useMyListings();
  const itemData = items.find((item) => item.id === id);
  const colorScheme = useColorScheme() ?? 'light';
  const titleColor = colorScheme === 'dark' ? '#5BA3FF' : '#0047AB';
  const backgroundColor = useThemeColor({}, 'background');
  const backButtonBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';
  const cardBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)';
  const borderColor = colorScheme === 'dark' ? '#5BA3FF' : '#0047AB';
  const unselectedTextColor = colorScheme === 'dark' ? '#999' : '#666';

  const [method, setMethod] = useState<TransactionMethod>('Delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [collectionLocation, setCollectionLocation] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const inputBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const inputPlaceholderColor = colorScheme === 'dark' ? '#888' : '#999';

  const handleSendOffer = () => {
    const num = parseFloat(offerPrice.replace(/[^0-9.]/g, ''));
    if (itemData && !isNaN(num) && num > 0) {
      setOfferPrice('');
      // TODO: send offer to seller
    }
  };

  const handleChatWithSeller = () => {
    router.push({ pathname: '/items/chat/[id]', params: { id: String(id), sellerName: `User${id}`, transactionMethod: method } });
  };

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
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]} numberOfLines={1}>
            Transaction
          </Text>
        </View>

        <View style={styles.content}>
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
              <View style={[styles.orderCard, { backgroundColor: cardBg }]}>
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
              </View>

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
                      onChangeText={setOfferPrice}
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
            </View>
          )}
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
