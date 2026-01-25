import { Image } from 'expo-image';
import { Platform, StyleSheet, Animated} from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view-horizontal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import TestData from '@/test-data.json'


export default function TabTwoScreen() {

  const item = TestData.items[0];

  const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';
  return (
    <ThemedView>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
        headerImage={<Image/>
        }>
        <ThemedView style={styles.cardContainer}>
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
    </ParallaxScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  cardContainer: {
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
  }
});
