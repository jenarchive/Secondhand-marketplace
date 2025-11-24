import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import TestData from '@/test-data.json'
import { ThemedText } from '@/components/themed-text';
import { DarkTheme } from '@react-navigation/native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image/>
      }>
        <ThemedView>
            {/* maps through test data and displays each item */}
            {TestData.items.map((item) => (
                <ThemedView style={styles.listingContainer} key={item.id}>
                    <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                    <ThemedText type="default">{item.description}</ThemedText>
                    <ThemedText type="default">${item.price}</ThemedText>
                </ThemedView>
            ))}
        </ThemedView>

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  //defines style for each listing container
  listingContainer: {
    gap: 12,
    marginBottom: 16,
    outlineWidth: 1,
    outlineColor: DarkTheme.colors.border,
    padding: 12,
    borderRadius: 8,
  },
});
