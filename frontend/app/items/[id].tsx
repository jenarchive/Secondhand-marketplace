import { Image } from 'expo-image';
import { Platform, StyleSheet, Pressable, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import TestData from '@/test-data.json'
import { ThemedText } from '@/components/themed-text';
import { DarkTheme } from '@react-navigation/native';
import { Link } from 'expo-router';
import { use, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function HomeScreen() {

  const id = Number(useLocalSearchParams().id);
  const itemData = TestData.items[id - 1];

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const MyData = {
    id: itemData.id,
    title: itemData.title,
    description: itemData.description,
    price: itemData.price,
    image: itemData.image,
    category: itemData.category,
    location: itemData.location
  };

  // use item rating if available otherwise default to 4
  const userRatingValue: number = typeof (itemData as any).rating === 'number' ? (itemData as any).rating : 4;

  const insets = useSafeAreaInsets();

  const handleUserPress = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    // TODO: implement user profile navigation
    console.log('User profile pressed', MyData.id);
  };

  // action handlers for floating buttons
  const handleBuy = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
    // TODO: implement buy logic
    console.log('Buy now', MyData.id);
  };

  const handleMakeOffer = async () => {
    try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid); } catch {}
    // TODO: make-offer modal
    console.log('Make offer', MyData.id);
  };

  return (
    <>
    <ParallaxScrollView
      headerImage={<View style={{ height: 0 }} />}
      headerBackgroundColor={{ light: '#fff', dark: '#000' }}>
      <ThemedView style={styles.listingContainer}>
    <Pressable onPress={handleUserPress}>
    <ThemedView style={styles.userProfileContainer}>
      <ThemedView style={styles.userProfileImage}>
        <ThemedText type="defaultSemiBold">U</ThemedText>
      </ThemedView>
      <ThemedView style={styles.userMeta}>
        <ThemedText type="defaultSemiBold">User{itemData.id}</ThemedText>
        <ThemedText type="defaultSemiBold">{MyData.location}</ThemedText>
      </ThemedView>
      <ThemedView style={styles.userRating} accessibilityLabel={`Rating ${userRatingValue} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const starIndex = i + 1;
          const filled = starIndex <= Math.round(userRatingValue);
          return (
            <ThemedText
              key={starIndex}
              type="defaultSemiBold"
              style={{ color: filled ? '#FFD700' : '#666', marginHorizontal: 2 }}
            >
              {filled ? '★' : '☆'}
            </ThemedText>
          );
        })}
      </ThemedView>
    </ThemedView>
    </Pressable>
    <Image
                        alt={MyData.title}
                        style={styles.image}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                        source={{ uri: MyData.image }}
    />
  <ThemedView style={styles.listingTitle}>
    <ThemedText type="defaultSemiBold">{MyData.title}</ThemedText>
    <ThemedText type="default">Category: {MyData.category}</ThemedText>
    <ThemedView style={styles.priceContainer}>
      <ThemedText type="default">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(MyData.price)}</ThemedText>
      <ThemedText type="default">Price Incl Postage: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'GBP' }).format(MyData.price + 5)}</ThemedText>
    </ThemedView>
  </ThemedView>
  <ThemedView style={styles.listingDescription}>
    <ThemedView style={{ backgroundColor: 'transparent' }}>  
      <ThemedText type="defaultSemiBold">Description</ThemedText>
      <ThemedText type="default">{MyData.description}</ThemedText>
    </ThemedView>

  </ThemedView>
      </ThemedView>
    </ParallaxScrollView>

    {/* Floating action bar (fixed) */}
    <View style={[styles.floatingContainer, { paddingBottom: Math.max(insets.bottom, 12) }]}> 
      <Pressable style={styles.buyButton} onPress={handleBuy} accessibilityLabel="Buy now">
        <ThemedText type="defaultSemiBold">Buy Now</ThemedText>
      </Pressable>
      <Pressable style={styles.offerButton} onPress={handleMakeOffer} accessibilityLabel="Make offer">
        <ThemedText type="defaultSemiBold">Make Offer</ThemedText>
      </Pressable>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  listingContainer: {
    gap: 15, 
    marginBottom: 80
  },

  listingTitle: {
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#1A1A1A',
    borderRadius: 8
  },

  listingLink: {
    width: '48%',
    textDecorationLine: 'none',
    marginBottom: 16
  },

  image: {
    width: '100%',
    borderRadius: 8,
    aspectRatio: 1
  },

  //wraps children into two columns
  flexbox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  descriptionText: {
    textOverflow: "ellipsis",
    overflow: "hidden"
  },

  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    backgroundColor: '#1A1A1A',
  },

  listingDescription: {
    gap: 16,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: '#1A1A1A',
    borderRadius: 8
  },

  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 0,
    backgroundColor: '#1A1A1A',
    padding: 12,
    borderRadius: 8,
  },

  userProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userMeta: {
    backgroundColor: 'transparent',
    marginLeft: 12,
    flex: 1,
  },

  userRating: {
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
 ,
  floatingContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    width: 'auto',
    alignItems: 'center',
    zIndex: 1000,
  },

  buyButton: {
    backgroundColor: '#28289D',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 15,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },

  offerButton: {
    backgroundColor: '#28289D',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',

  }
});
