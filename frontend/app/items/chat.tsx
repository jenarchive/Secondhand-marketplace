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

export default function App() {
  const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const screenBg = useThemeColor({}, 'background');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const backgroundColor = useThemeColor({}, 'background');

  const params = useLocalSearchParams<{ myId?: string; targetId?: string }>();
  const router = useRouter();
  const { getItemById } = useMyListings();
  const { myListings } = useMyListings();
  // const myId = Number(params.myId);
  // const targetId = Number(params.targetId);
  const targetId = 1;
  const myItem = myListings[0];
  // const myItem = Number.isFinite(myId) ? getItemById(myId) : undefined;
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
            avatar: 'https://placeimg.com/140/140/any',
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
    // Style the main container to fill the screen
    <ThemedView style={styles.mainContiner}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.subContiner}>
        <View>
          {/* Header Area */}
          <ThemedView style={styles.userInfo}> 
            <UserHeader itemId={1}
              userLocation={"New York, NY"}
              userRating={4}
              userId={1}
              displayName={undefined} />
          </ThemedView>

          {/* Product Info */}
          <ThemedView style={styles.flexbox}> 
            <View style={styles.contentWrap}>
              <View style={styles.cardsRow}>
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
                <View pointerEvents="none" style={styles.tradeIconWrap}>
                  <Ionicons name="swap-horizontal" size={25} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </ThemedView>
        </View>
      </TouchableWithoutFeedback>
      
      {/* Chat Area (MUST HAVE FLEX: 1) */}
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
    // borderWidth: 1,
    // borderColor: 'white',
  }, 
  subContiner: {
    flex: 1, 
    borderWidth: 1,
    borderColor: 'white',
  }, 
  userInfo: {
    borderWidth: 1,
    borderColor: 'white',
  }, 
  flexbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 64,
    borderWidth: 1,
    borderColor: 'white',
  },  
  contentWrap: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 0,
    paddingTop: 10,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    position: 'relative',
  },
  itemColumn: {
    flex: 1,
    alignItems: 'center',
  },
  cardTopLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardTopLabelMy: {
    color: '#FFFFFF',
  },
  cardTopLabelMatch: {
    color: '#FF9500',
  },
  itemCard: {
    width: '80%',
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
  itemDescription: {
    fontSize: 12,
    opacity: 0.8,
    lineHeight: 17,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 4,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    marginTop: 24,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A84FF',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  tradeIconWrap: {
    position: 'absolute',
    left: '50%',
    top: '46%',
    marginLeft: -10,
    marginTop: -1,
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
    borderWidth: 1,
    borderColor: 'white',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
});