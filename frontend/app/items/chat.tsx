import { ThemedView } from "@/components/themed-view";
import UserHeader from "@/components/user-header";
import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import type { MyListingItem } from '@/store/myListingsStore';
import { getItems, setItems as setStoreItems } from '@/store/myListingsStore';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image } from 'expo-image';
import { ThemedText } from "@/components/themed-text";
import { router } from "expo-router";

export default class App extends React.Component {
  state = {
    messages: [
      {
        _id: 1,
        text: "Hello, this is user 1",
        createdAt: new Date(),
        user: {
        _id: 2, 
        name: "React Native User",
        avatar: "https://www.istockphoto.com/photos/placeholder-image",
      },
      }
    ]
  };
  
  // const blurhash = '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  
  // const screenBg = useThemeColor({}, 'background');

render() {
    return (
      <ThemedView style={[styles.container]}>
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
          {/* <ThemedView style={styles.listingContainer}> */}
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
                  // placeholder={{ blurhash }}
                  contentFit="cover"
                  source="https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&h=600&fit=crop"
                />
              </ThemedView>
              <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ flexShrink: 1, color: '#fff' }}>{"Used Bicycle"}</ThemedText>
              <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>{new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(150)}</ThemedText>
            </Pressable>
          {/* </ThemedView> */}
        </ThemedView>
        <GiftedChat messages={this.state.messages} />
      </ThemedView>
    );
  }
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