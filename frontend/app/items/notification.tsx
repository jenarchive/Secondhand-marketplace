import {Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stack, Link, Href, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ThemedText } from '@/components/themed-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
  

export default function NotificationScreen() {
  const screenBg = useThemeColor({}, 'background');
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView >
        <Stack.Screen
          options={{
            title: 'Notifications',
            headerShown: true,
            headerRight: () => (
              <Pressable
                style={({ pressed }) => [
                  { padding: 8, marginRight: 20, opacity: pressed ? 0.7 : 1 },
                ]}> 
                <Ionicons
                name={'reorder-three'}
                size={28}/>
              </Pressable>
                          
            )}}
        />
        <ScrollView
          contentContainerStyle={[styles.listContent, { paddingTop: 50 }]}
          contentInsetAdjustmentBehavior="never"
          style={styles.listcontainer}
          showsVerticalScrollIndicator={false}
        >
          <Pressable
            onPress={async () => {
              router.push(`/items/chat`);
            }}
            style={[styles.card && styles.firstCard]}
          >
            {/* <View style={styles.imageWrapper}>
              <Image
                source="https://www.istockphoto.com/photos/placeholder-image"
                style={styles.imagePlaceholder}
              />
            </View> */}
            <View style={styles.infoContainer}>
              <ThemedText style={[styles.productName]} numberOfLines={1}>
                You haved matched with user 1. 
              </ThemedText>
              <ThemedText style={[styles.price]}>
                {/* {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(300)} */}
              </ThemedText>
            </View>
          </Pressable>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>

    


  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    // borderWidth: 1, 
    // borderColor: "white",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  firstCard: {
    marginTop: 0,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 16,
    borderWidth: 1, 
    borderColor: "white",
  },
  imagePlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 12,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    // borderWidth: 1, 
    // borderColor: "white",
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listcontainer: {
    // flex: 1,
    // borderWidth: 1, 
    // borderColor: "white",
  },
});
