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

export default function App() {
    const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
    const screenBg = useThemeColor({}, 'background');
    const [messages, setMessages] = useState<IMessage[]>([]);
  
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
    <ThemedView style={{ flex: 1, backgroundColor: screenBg }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            <Pressable 
              style={({ pressed }) => [styles.listingLink, pressed && styles.pressed]}
              key={`${1}-${"Used Bicycle"}`}
              onPress={() => {
                router.push(`/items/${1}`);
              }}
              onLongPress={() => {
                router.push(`/items/${1}`);
              }}
            >
              <ThemedView style={styles.imageWrapper}>
                <Image
                  style={styles.image}
                  contentFit="cover"
                  placeholder={{ blurhash }}
                  source="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=600&fit=crop"
                />
              </ThemedView>
              <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ flexShrink: 1, color: '#fff' }}>{"Used Bicycle"}</ThemedText>
              <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(150)}</ThemedText>
              <FontAwesome
                name={"exchange"} 
                size={20}
                color={'#FFFFFF'}
              />
            </Pressable>
          </ThemedView>
        </View>
      </TouchableWithoutFeedback>
      
      {/* Chat Area (MUST HAVE FLEX: 1) */}
      <View style={{ flex: 1 }}> 
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
  container: {
    flex: 1,
    paddingBottom: 30,
  }, 
  userInfo: {
  }, 
  image: {
    width: '100%',
    borderRadius: 8,
    aspectRatio: 1
  },
  imageWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  flexbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 64
  },  
  listingLink: {
    flexBasis: '35%',
    maxWidth: '35%',
    textDecorationLine: 'none',
    marginBottom: 16,
    overflow: 'hidden'
  },
  pressed: {
    opacity: 0.85
  },
});