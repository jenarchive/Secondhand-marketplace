import { Alert, Keyboard, TouchableWithoutFeedback, View, StyleSheet, Pressable, Text, TextInput, Platform } from 'react-native';
import { ThemedView } from "@/components/themed-view";
import UserHeader from "@/components/user-header";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'expo-image';
import { ThemedText } from "@/components/themed-text";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMyListings } from '@/contexts/MyListingsContext';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { addMessageForItem, getMessagesForItem, type ChatMessage } from '@/store/chatStore';

const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

function formatMessageTime(sentAt: number): string {
  return new Date(sentAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getMatchChatKey(myId: number, targetId: number): number {
  return myId < targetId
    ? myId * 1000003 + targetId
    : targetId * 1000003 + myId;
}

export default function App() {
  const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<{
    myId?: string;
    targetId?: string;
    sellerName?: string;
    source?: string | string[];
    fromMarketplace?: string | string[];
    fromExplore?: string | string[];
    fromLikedItems?: string | string[];
  }>();
  const router = useRouter();
  const { getItemById, removeNotification } = useMyListings();
  const myId = Number(params.myId);
  const targetId = Number(params.targetId);
  const chatKey = Number.isFinite(myId) && Number.isFinite(targetId) ? getMatchChatKey(myId, targetId) : 0;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => (chatKey ? getMessagesForItem(chatKey) : []));
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const inputRef = useRef<TextInput | null>(null);
  const myItem = Number.isFinite(myId) ? getItemById(myId) : undefined;
  const targetItem = Number.isFinite(targetId) ? getItemById(targetId) : undefined;
  const headerTitle = params.sellerName ?? (Number.isFinite(targetId) ? `User${targetId}` : 'Chat');
  const sourceParam = params.source;
  const source = Array.isArray(sourceParam) ? sourceParam[0] : sourceParam;
  const fromMarketplaceParam = params.fromMarketplace;
  const fromMarketplace = (Array.isArray(fromMarketplaceParam) ? fromMarketplaceParam[0] : fromMarketplaceParam) === 'true';
  const fromExploreParam = params.fromExplore;
  const fromExplore = (Array.isArray(fromExploreParam) ? fromExploreParam[0] : fromExploreParam) === 'true';
  const fromLikedItemsParam = params.fromLikedItems;
  const fromLikedItems = (Array.isArray(fromLikedItemsParam) ? fromLikedItemsParam[0] : fromLikedItemsParam) === 'true';
  const inputBarBg = colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const placeholderColor = colorScheme === 'dark' ? '#888' : '#999';
  const menuPanelBg = colorScheme === 'dark' ? 'rgba(30,30,30,0.98)' : '#FFF';
  const borderColor = colorScheme === 'dark' ? '#5BA3FF' : '#0047AB';
  const fullPadding = Math.max(insets.bottom, 12) + 12;
  const DEFAULT_PANEL_HEIGHT = 280;
  const panelHeight = keyboardHeight > 0 ? keyboardHeight : DEFAULT_PANEL_HEIGHT;
  const inputBarPadding = (keyboardVisible || showMoreMenu) ? 8 : fullPadding;
  const bottomPadding = keyboardVisible && !showMoreMenu ? keyboardHeight : 0;

  const handleUnmatch = () => {
    Alert.alert('Unmatch', 'This match has been removed.', [
      {
        text: 'OK',
        onPress: () => {
          if (Number.isFinite(myId) && Number.isFinite(targetId)) {
            removeNotification(myId, targetId);
          }
          router.back();
        },
      },
      {
        text: 'Cancel',
      },
    ]);
  };

  if (!targetItem) {
      return (
        <View style={[styles.screen, styles.center, { backgroundColor }]}>
          <ThemedText>Item not found.</ThemedText>
        </View>
      );
    }

  useEffect(() => {
    if (!chatKey) return;
    setMessages(getMessagesForItem(chatKey));
  }, [chatKey]);

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

  const handleSend = useCallback(() => {
    const trimmed = message.trim();
    if (!trimmed || !chatKey) return;
    const newMessage = addMessageForItem(chatKey, trimmed);
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  }, [chatKey, message]);

  const handleMorePress = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
    setShowMoreMenu(true);
  };

  const handleCloseMore = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
    setShowMoreMenu(false);
  };

  const handleMainPress = () => {
    inputRef.current?.blur();
    Keyboard.dismiss();
    setShowMoreMenu(false);
  };

  const handleBack = () => {
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
    router.back();
  };

  const pushAttachmentMessage = (prefix: 'photo' | 'video', fileName?: string | null) => {
    if (!chatKey) return;
    const fallback = prefix === 'photo' ? 'Photo' : 'Video';
    const label = fileName ? `Sent ${prefix}: ${fileName}` : `Sent ${fallback}`;
    const newMessage = addMessageForItem(chatKey, label);
    setMessages((prev) => [...prev, newMessage]);
  };

  const requestMediaPermission = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) return true;
    Alert.alert('Permission needed', 'Please allow photo library access to send media.');
    return false;
  };

  const handleSendPhoto = async () => {
    const granted = await requestMediaPermission();
    if (!granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      quality: 0.9,
    });
    if (result.canceled || !result.assets.length) return;
    pushAttachmentMessage('photo', result.assets[0]?.fileName);
    handleCloseMore();
  };

  const handleSendVideo = async () => {
    const granted = await requestMediaPermission();
    if (!granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsMultipleSelection: false,
      quality: 0.9,
    });
    if (result.canceled || !result.assets.length) return;
    pushAttachmentMessage('video', result.assets[0]?.fileName);
    handleCloseMore();
  };

  return (
    <ThemedView style={[styles.mainContiner, { paddingBottom: bottomPadding }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable
          style={[styles.backButton, { backgroundColor: BACK_BUTTON_BG }]}
          onPress={handleBack}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>{headerTitle}</ThemedText>
        {myItem && (
          <Pressable style={styles.unmatchButton} onPress={handleUnmatch}>
            <Ionicons name="close" size={19} color="#FFFFFF" />
          </Pressable>
        )}
      </View>
      <TouchableWithoutFeedback onPress={handleMainPress}>
        <View style={styles.contentWrap}>
          {showMoreMenu && (
            <Pressable style={styles.moreOverlay} onPress={handleCloseMore} />
          )}
          <ThemedView style={styles.userInfo}> 
            <View style={styles.userCardScaleWrap}>
              <UserHeader
                itemId={targetItem.id}
                userLocation={targetItem.location}
                userRating={4}
                userId={targetItem.id}
                displayName={undefined}
              />
            </View>
          </ThemedView>

          <ThemedView style={styles.flexbox}> 
            <View style={styles.cardsWrap}>
              {myItem ? (
                <View style={styles.cardsRow}>
                  <View style={styles.itemColumn}>
                    <ThemedText style={[styles.cardTopLabel, styles.cardTopLabelMy]}>My Listing</ThemedText>
                    <Pressable style={styles.itemCard} onPress={() => router.push(`/items/${myItem.id}`)}>
                      <Image
                        source={{ uri: myItem.image }}
                        style={styles.itemImage}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                      />
                      <ThemedText style={styles.itemTitle} numberOfLines={1}>{myItem.title}</ThemedText>
                    </Pressable>
                  </View>
                  <View style={styles.itemColumn}>
                    <ThemedText style={[styles.cardTopLabel, styles.cardTopLabelMatch]}>Item to Match</ThemedText>
                    <Pressable style={styles.itemCard} onPress={() => router.push(`/items/${targetItem.id}`)}>
                      <Image
                        source={{ uri: targetItem.image }}
                        style={styles.itemImage}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                      />
                      <ThemedText style={styles.itemTitle} numberOfLines={1}>{targetItem.title}</ThemedText>
                    </Pressable>
                  </View>
                  <View pointerEvents="none" style={styles.tradeIconWrap}>
                    <Ionicons name="swap-horizontal" size={25} color="#FFFFFF" />
                  </View>
                </View>
              ) : (
                <View style={styles.singleCardWrap}>
                  <ThemedText style={[styles.cardTopLabel, styles.cardTopLabelMatch]}>Ordered Product</ThemedText>
                  <Pressable style={styles.itemCardSingle} onPress={() => router.push(`/items/${targetItem.id}`)}>
                    <Image
                      source={{ uri: targetItem.image }}
                      style={styles.itemImage}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                    />
                    <ThemedText style={styles.itemTitle} numberOfLines={1}>{targetItem.title}</ThemedText>
                  </Pressable>
                </View>
              )}
            </View>
          </ThemedView>
          <View style={styles.chatbox}>
            <View style={styles.messagesContainer}>
              {messages.map((m, index) => (
                <View key={`${m.sentAt}-${index}-${m.text}`} style={styles.messageBubbleMe}>
                  <Text style={styles.messageText}>{m.text}</Text>
                  <Text style={styles.messageMeta}>{formatMessageTime(m.sentAt)}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bottomWrap}>
        <View style={[styles.inputBar, { backgroundColor: inputBarBg, paddingBottom: inputBarPadding, paddingTop: 12 }]}>
          <Pressable style={[styles.moreButton, { backgroundColor: BACK_BUTTON_BG }]} onPress={handleMorePress}>
            <Ionicons name="add" size={24} color={colorScheme === 'dark' ? '#fff' : '#000'} />
          </Pressable>
          <TextInput
            ref={inputRef}
            style={[styles.messageInput, { color: '#FFFFFF' }]}
            placeholder="Enter your message."
            placeholderTextColor={placeholderColor}
            value={message}
            onChangeText={setMessage}
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
          <View style={{ height: panelHeight, backgroundColor: menuPanelBg }}>
            <View style={styles.morePanelInner}>
              <View style={styles.morePanelRow}>
                <Pressable
                  style={styles.morePanelOption}
                  onPress={handleSendPhoto}
                >
                  <View style={[styles.morePanelIconCircle, { backgroundColor: BACK_BUTTON_BG }]}>
                    <Ionicons name="image-outline" size={36} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                  </View>
                  <Text style={styles.morePanelLabel}>Send photo</Text>
                </Pressable>
                <Pressable
                  style={styles.morePanelOption}
                  onPress={handleSendVideo}
                >
                  <View style={[styles.morePanelIconCircle, { backgroundColor: BACK_BUTTON_BG }]}>
                    <Ionicons name="videocam-outline" size={36} color={colorScheme === 'dark' ? '#fff' : '#000'} />
                  </View>
                  <Text style={styles.morePanelLabel}>Send video</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContiner: {
    flex: 1,
    paddingTop: 100,
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
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 0,
    padding: 4,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  unmatchButton: {
    position: 'absolute',
    right: 20,
    bottom: 1,
    height: 36,
    width: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
  },
  userInfo: {
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 14,
    marginBottom: 10,
  },
  userCardScaleWrap: {
    width: '94%',
    transform: [{ scale: 0.96 }],
  }, 
  flexbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },  
  cardsWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 0,
    paddingTop: 18,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 2,
    position: 'relative',
    width: '94%',
    alignSelf: 'center',
  },
  itemColumn: {
    flex: 1,
    alignItems: 'center',
  },
  cardTopLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardTopLabelMy: {
    color: '#FFFFFF',
  },
  cardTopLabelMatch: {
    color: '#FF9500',
  },
  itemCard: {
    width: '86%',
    borderRadius: 14,
    padding: 10,
    backgroundColor: '#25282B',
  },
  itemImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  tradeIconWrap: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    marginLeft: -12,
    marginTop: -12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatbox: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  contentWrap: {
    flex: 1,
  },
  messagesContainer: {
    flexGrow: 1,
    gap: 8,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
  messageMeta: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    lineHeight: 14,
    marginTop: 4,
    alignSelf: 'flex-end',
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
    color: '#999999',
  },
});