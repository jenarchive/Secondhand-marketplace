import { Image } from 'expo-image';
import { Platform, StyleSheet, Animated, Button, Pressable} from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view-horizontal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TestData from '@/test-data.json'
import { useState } from 'react';
import { Butterfly } from '@/components/butterfly';
import { Link } from 'expo-router';


export default function TabTwoScreen() {
  const [visibleItems, setVisibleItems] = useState(TestData.items);
  const [butterflies, setButterflies] = useState<number[]>([]);

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  
  const spawnButterfly = () => {
    const id = Date.now();
    setButterflies((prev) => [...prev, id]);
  };

  const removeButterfly = (id: number) => {
    setButterflies((prev) => prev.filter((b) => b !== id));
  };

  const handleCardDismiss = () => {
    setVisibleItems(prev => prev.slice(0, -1));
  };

  const resetCards = () => {
    setVisibleItems(TestData.items);
  }

  return (
    <ThemedView>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Image/>
        }
        onCardDismiss={handleCardDismiss}
      >
        {visibleItems.map((item, index) => (
        <ThemedView 
          style={[styles.cardContainer, { zIndex: index+1 }]} 
          key={item.id}
          pointerEvents={index === visibleItems.length - 1 ? 'auto' : 'none'}
        >
          <Image 
            placeholder={{ blurhash }}
            alt={item.title}
            style={styles.cardImage}
            contentFit="cover"
            source={{ uri: item.image }}
            ></Image>
          <ThemedView style={styles.cardTextWrapper}>
            <ThemedText style={styles.cardText}>
              {item.title}
            </ThemedText>
            <ThemedText style={styles.cardTextPrice}>
              {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(item.price)}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        ))}
        <ThemedView style={{ zIndex: 0 }}>
          {/* <Button title='generate butterfly' onPress={spawnButterfly} />
            {butterflies.map((id) => (
            <Butterfly
              key={id}
              onFinish={() => removeButterfly(id)}
            />
      ))} */}
          {visibleItems.length === 0 && (
        <Link href="/(tabs)/liked-items" asChild>
          <Pressable>
            <ThemedView style={styles.row}>
              <ThemedText style={styles.text}>
                Check items that you liked
              </ThemedText>
            </ThemedView>
          </Pressable>
        </Link>
    )}
        </ThemedView>
    </ParallaxScrollView>
    {visibleItems.length === 0 && (
      <Animated.View style={{ alignItems: 'center', marginTop: 0}}>
          <ThemedText style={{ fontSize: 16, marginBottom: 12 }}>No more items!</ThemedText>
          <ThemedText 
            style={{ fontSize: 16, color: 'blue' }}
            onPress={resetCards}
          >
            Reset items
          </ThemedText>
      </Animated.View>
    )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cardContainer: {
    position: 'absolute',
    marginTop: 32,
    borderRadius: 32,
    height: '100%',
    alignItems: 'center',
    aspectRatio: 9/16,
    justifyContent: 'center',
  },
  cardImage:{ 
    borderRadius: 16,
    position: 'absolute',
    height: '100%',
    aspectRatio: 9/16,
  },
  cardText:{
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  cardTextPrice:{
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center'
  },
  cardTextWrapper:{
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: 6,
    borderRadius: 8,
  },
  linkToLikedItems:{
    alignItems: 'center',
  },
  row: {
    width: 300,
    height: 60,
    borderRadius: 25,
    alignItems: "center", 
    justifyContent: 'center',
    fontSize:18, 
    backgroundColor: '#28289D'
  },
  text:{
    fontSize: 18, 
  },
});
