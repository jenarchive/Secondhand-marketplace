import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Pressable, TextInput, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMyListings } from '@/contexts/MyListingsContext';
import { getMessagesForItem, addMessageForItem } from '@/store/chatStore';
import { setAcceptedOfferItemPrice, setOfferForItem } from '@/store/transactionStore';

const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ id: string; sellerName?: string; transactionMethod?: string; offerPrice?: string; fromOfferSent?: string }>();
  const router = useRouter();
  const id = Number(params.id);
  const { items } = useMyListings();
  const itemData = items.find((item) => item.id === id);
  const colorScheme = useColorScheme() ?? 'light';
  const backgroundColor = useThemeColor({}, 'background');
  const headerTitle = params.sellerName ?? `User${params.id}`;
  const unselectedTextColor = colorScheme === 'dark' ? '#999' : '#666';
  const borderColor = colorScheme === 'dark' ? '#5BA3FF' : '#0047AB';
  const showPostage = params.transactionMethod === 'Delivery';
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [messages, setMessages] = useState<string[]>(() => getMessagesForItem(id));
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputBarBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const placeholderColor = colorScheme === 'dark' ? '#888' : '#999';
  const menuPanelBg = colorScheme === 'dark' ? 'rgba(30,30,30,0.98)' : '#FFF';
  const fullPadding = Math.max(insets.bottom, 12) + 12;
  const DEFAULT_PANEL_HEIGHT = 280;
  const panelHeight = keyboardHeight > 0 ? keyboardHeight : DEFAULT_PANEL_HEIGHT;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (e: any) => {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates?.height ?? DEFAULT_PANEL_HEIGHT);
      setShowMoreMenu(false);
    });
    const hide = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const inputBarPadding = (keyboardVisible || showMoreMenu) ? 8 : fullPadding;
  const bottomPadding = keyboardVisible && !showMoreMenu ? keyboardHeight : 0;

  const handleMorePress = () => {
    Keyboard.dismiss();
    setShowMoreMenu(true);
  };

  const handleCloseMore = () => {
    setShowMoreMenu(false);
  };

  const handleInputFocus = () => {};

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    addMessageForItem(id, trimmed);
    setMessages((prev) => [...prev, trimmed]);
    setMessage('');
  };

  const handleAcceptOffer = () => {
    const offerNum = Number(params.offerPrice);
    if (!Number.isFinite(offerNum) || offerNum <= 0) return;
    setAcceptedOfferItemPrice(id, offerNum);
    setOfferForItem(id, String(offerNum));
    router.replace({ pathname: '/items/transaction/[id]', params: { id: String(id) } });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { backgroundColor, paddingBottom: bottomPadding }]}>
        <View style={[styles.header, { backgroundColor }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: BACK_BUTTON_BG }]}
            onPress={() => {
              if (params.fromOfferSent === 'true' && params.id) {
                router.replace({ pathname: '/items/transaction/[id]', params: { id: String(id) } });
              } else {
                router.back();
              }
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: '#FFFFFF' }]} numberOfLines={1}>
            {headerTitle}
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.contentWrap}>
            {showMoreMenu && (
              <Pressable style={styles.moreOverlay} onPress={handleCloseMore} />
            )}
            <View style={styles.content}>
              {itemData && (
                <>
                  <View style={styles.productRow}>
                    <Image
                      source={{ uri: itemData.image }}
                      style={styles.productImage}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                    />
                    <View style={styles.productBody}>
                      <Text style={[styles.productTitle, { color: '#FFFFFF' }]} numberOfLines={1}>
                        {itemData.title}
                      </Text>
                      <Text style={[styles.productPrice, { color: '#FFFFFF' }]}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(itemData.price)}
                      </Text>
                      {showPostage && (
                        <Text style={[styles.productPostage, { color: unselectedTextColor }]}>
                          Postage £2.50
                        </Text>
                      )}
                    </View>
                  </View>

                  <Pressable
                    style={[styles.viewDetailsButton, { backgroundColor: '#2563EB' }]}
                    onPress={() => router.push({ pathname: `/items/${id}`, params: { fromChat: 'true' } })}
                  >
                    <Text style={styles.viewDetailsButtonText}>View details</Text>
                  </Pressable>
                </>
              )}

              {(params.offerPrice && !Number.isNaN(Number(params.offerPrice))) || messages.length > 0 ? (
                <View style={styles.messagesContainer}>
                  {params.offerPrice && !Number.isNaN(Number(params.offerPrice)) && (
                    <View style={[styles.offerCard, { backgroundColor: inputBarBg }]}>
                      <Text style={styles.offerCardTitle}>
                        (Username) has made an offer.
                      </Text>
                      <Text style={styles.offerCardBody}>
                        {new Intl.NumberFormat('en-GB', {
                          style: 'currency',
                          currency: 'GBP',
                        }).format(Number(params.offerPrice))}
                      </Text>
                      <Pressable style={styles.acceptOfferButton} onPress={handleAcceptOffer}>
                        <Text style={styles.acceptOfferButtonText}>Accept offer</Text>
                      </Pressable>
                    </View>
                  )}

                  {messages.map((m, index) => (
                    <View key={`${index}-${m}`} style={styles.messageBubbleMe}>
                      <Text style={styles.messageText}>{m}</Text>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        </TouchableWithoutFeedback>

        <View style={styles.bottomWrap}>
          <View style={[styles.inputBar, { backgroundColor: inputBarBg, paddingBottom: inputBarPadding, paddingTop: 12 }]}>
            <Pressable style={[styles.moreButton, { backgroundColor: BACK_BUTTON_BG }]} onPress={handleMorePress}>
              <Ionicons name="add" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </Pressable>
            <TextInput
              style={[styles.messageInput, { color: '#FFFFFF' }]}
              placeholder="Enter your message."
              placeholderTextColor={placeholderColor}
              value={message}
              onChangeText={setMessage}
              onFocus={handleInputFocus}
              multiline
              maxLength={500}
            />
            <Pressable
              style={[styles.sendButton, { backgroundColor: message.trim() ? borderColor : BACK_BUTTON_BG }]}
              onPress={handleSend}
            >
              <Ionicons name="arrow-up" size={22} color={colorScheme === 'dark' ? '#fff' : '#000'} />
            </Pressable>
          </View>

          {showMoreMenu && (
            <View style={[styles.morePanelWrap, { height: panelHeight, backgroundColor: menuPanelBg }]}>
              <View style={styles.morePanelInner}>
                <View style={styles.morePanelRow}>
                  <Pressable
                    style={styles.morePanelOption}
                    onPress={handleCloseMore}
                  >
                    <View style={[styles.morePanelIconCircle, { backgroundColor: BACK_BUTTON_BG }]}>
                      <Ionicons name="image-outline" size={36} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    </View>
                    <Text style={[styles.morePanelLabel, { color: unselectedTextColor }]}>Send photo</Text>
                  </Pressable>
                  <Pressable
                    style={styles.morePanelOption}
                    onPress={handleCloseMore}
                  >
                    <View style={[styles.morePanelIconCircle, { backgroundColor: BACK_BUTTON_BG }]}>
                      <Ionicons name="videocam-outline" size={36} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                    </View>
                    <Text style={[styles.morePanelLabel, { color: unselectedTextColor }]}>Send video</Text>
                  </Pressable>
                </View>
              </View>
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
  contentWrap: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 100 + 12,
    paddingHorizontal: 20,
    paddingBottom: 12,
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
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
    zIndex: 300,
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
  bottomWrap: {
    zIndex: 300,
  },
  moreOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 200,
  },
  morePanelWrap: {},
  morePanelInner: {
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  morePanelRow: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 20,
  },
  morePanelOption: {
    alignItems: 'center',
    gap: 10,
  },
  morePanelIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  morePanelLabel: {
    fontSize: 13,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingTop: 0,
    paddingBottom: 0,
    gap: 8,
    alignItems: 'flex-end',
  },
  offerCard: {
    alignSelf: 'flex-end',
    width: 156,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 2,
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
  acceptOfferButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  messageBubbleMe: {
    alignSelf: 'flex-end',
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderBottomRightRadius: 4,
    backgroundColor: '#2563EB',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 18,
  },
});
