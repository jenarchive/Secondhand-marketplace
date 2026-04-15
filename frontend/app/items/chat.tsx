import { Keyboard, TouchableWithoutFeedback, View, StyleSheet, Pressable } from 'react-native';
import { ThemedView } from "@/components/themed-view";
import UserHeader from "@/components/user-header";
import React, { useCallback, useState, useEffect } from "react";
import { GiftedChat,IMessage } from "react-native-gifted-chat";
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'expo-image';
import { ThemedText } from "@/components/themed-text";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useMyListings } from '@/contexts/MyListingsContext';
import { Ionicons } from '@expo/vector-icons';

const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

export default function App() {
  const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const screenBg = useThemeColor({}, 'background');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const backgroundColor = useThemeColor({}, 'background');

  const params = useLocalSearchParams<{ myId?: string; targetId?: string }>();
  const router = useRouter();
  const { getItemById } = useMyListings();
  const { myListings } = useMyListings();
  const myId = Number(params.myId);
  const targetId = Number(params.targetId);
  const myItem = Number.isFinite(myId) ? getItemById(myId) : undefined;
  const targetItem = Number.isFinite(targetId) ? getItemById(targetId) : undefined;

  if (!myItem || !targetItem) {
      return (
        <View style={[styles.screen, styles.center, { backgroundColor }]}>
          <ThemedText>Match items not found.</ThemedText>
        </View>
      );
    }

  useEffect(() => {
      setMessages([
        {
          _id: 1,
          text: 'Hello Developer! Send me a message.',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native Bot',
            avatar: 'https://picsum.photos/seed/66/140/140',
          },
        },
      ]);
    }, []);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages),
    );
    
    Keyboard.dismiss(); 

    setTimeout(() => {
          const reply: IMessage = {
            _id: Math.random(), // Note: In production, use a more robust ID generator
            text: "I received your message!",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native Bot',
              avatar: 'https://placeimg.com/140/140/any',
            },
          };
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [reply])
          );
        }, 1500);
  }, []);

  return (
    <ThemedView style={styles.mainContiner}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <Pressable
          style={[styles.backButton, { backgroundColor: BACK_BUTTON_BG }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <ThemedText style={styles.headerTitle}>Chat</ThemedText>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
        <View>
          {/* Header Area */}
          <ThemedView style={styles.userInfo}> 
            <View style={styles.userCardScaleWrap}>
              <UserHeader
                itemId={1}
                userLocation={"New York, NY"}
                userRating={4}
                userId={1}
                displayName={undefined}
              />
            </View>
          </ThemedView>

          {/* Product Info */}
          <ThemedView style={styles.flexbox}> 
            <View style={styles.contentWrap}>
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
            </View>
          </ThemedView>
        </View>
      </TouchableWithoutFeedback>
      
      {/* Chat Area */}
      <View style={styles.chatbox}> 
        <GiftedChat
          messages={messages}
          onSend={(msgs) => onSend(msgs)}
          user={{ _id: 1 }}
          listProps={{
            keyboardShouldPersistTaps: 'never',
          }}
        />
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
  contentWrap: {
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
    paddingBottom: '8%',
  },
});