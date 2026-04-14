import { ThemedView } from "@/components/themed-view";
import UserHeader from "@/components/user-header";
import React, { useCallback, useState } from "react";
import { StyleSheet, Pressable } from "react-native";
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

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages),
    );
  }, []);

    return (
      <ThemedView style={[styles.container, { backgroundColor: screenBg }]}>
        <ThemedView style={styles.userInfo}> 
        <UserHeader
          itemId={1}
          userLocation={"New York, NY"}
          userRating={4}
          userId={1}
          displayName={undefined}
        />
        </ThemedView>
          <ThemedView style={styles.flexbox}> 
          <Pressable
            key={`${1}-${"Used Bicycle"}`}
            style={({ pressed }) => [styles.listingLink, pressed && styles.pressed]}
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
        <GiftedChat messages={messages} onSend={(messages) => onSend(messages)} user={{ _id: 1 }} colorScheme="dark"/>
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
    flexBasis: '48%',
    maxWidth: '48%',
    textDecorationLine: 'none',
    marginBottom: 16,
    overflow: 'hidden'
  },
  pressed: {
    opacity: 0.85
  },
});