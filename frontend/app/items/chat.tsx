import { ThemedView } from "@/components/themed-view";
import UserHeader from "@/components/user-header";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { GiftedChat,IMessage } from "react-native-gifted-chat";
import { useMyListings } from '@/contexts/MyListingsContext';
import { getItems, setItems as setStoreItems } from '@/store/myListingsStore';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'expo-image';
import { ThemedText } from "@/components/themed-text";
import { router } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function App() {
  const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  const screenBg = useThemeColor({}, 'background');
  const { myListings } = useMyListings();
  const [messages, setMessages] = useState<IMessage[]>([]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages),
    );
  }, []);

    return (
      <ThemedView style={[styles.container, { backgroundColor: screenBg }]}>
        <ThemedView style={styles.userInfo}> 
        {/* include the opposite user: username, avatar and ratings */}
        <UserHeader
          itemId={1}
          userLocation={"New York, NY"}
          userRating={4}
          userId={1}
          displayName={undefined}
        />
        </ThemedView>
          <ThemedView style={styles.flexbox}> 
          {/* include each items that the other liked (like marketplace?) */}
          {/* the other user's product that "I" liked */}
          <Pressable
            key={`${1}-${"Used Bicycle"}`}
            style={({ pressed }) => [styles.listingLink, pressed && styles.pressed]}
            onPress={async () => {
              // light selection haptic and navigate
              router.push(`/items/${1}`);
            }}
            onLongPress={async () => {
              // stronger feedback on long press
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
          {/* my object that the other user liked */}
          {/* {myListings.map((item) => (
              <Pressable
                key={`${item.id}-${item.title}`}
                style={({ pressed }) => [styles.listingLink, pressed && styles.pressed]}
                onPress={async () => {
                  // light selection haptic and navigate
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  router.push(`/items/${item.id}`);
                }}
                onLongPress={async () => {
                  // stronger feedback on long press
                  await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                  router.push(`/items/${item.id}`);
                }}
              >
                <ThemedView style={styles.listingContainer}>
                  <ThemedView style={styles.imageWrapper}>
                    <Image
                      alt={item.title}
                      style={styles.image}
                      placeholder={{ blurhash }}
                      contentFit="cover"
                      source={{ uri: item.image }}
                    />
                    <Pressable
                      style={styles.likeButton}
                      onPress={(e) => {
                        e.stopPropagation?.();
                        if (isMyListing(item.id)) {
                          Alert.alert('', 'This is your posted product.');
                          return;
                        }
                        toggleLike(item.id);
                      }}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={isLiked(item.id) ? 'heart' : 'heart-outline'}
                        size={20}
                        color={isLiked(item.id) ? '#FF3B30' : '#FFFFFF'}
                      />
                    </Pressable>
                  </ThemedView>
                  <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ flexShrink: 1, color: '#fff' }}>{item.title}</ThemedText>
                  <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}</ThemedText>
                </ThemedView>
              </Pressable>
            ))} */}
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
  tradingInfo: {
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