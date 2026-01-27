import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, vertialscale } from "../styles/scaling";


const { height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>
    {/* avatar, name and email (with link to change) */}
    <View style={styles.profileView}>
      
    </View>
    
    {/* purchase history  */}

    {/* liked items */}

    {/* reviews */}

    {/* current listing (selling list)  */}

    {/* settings */}

    </SafeAreaView>
  );
}

const colours = {
  container: '#353636',
};

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  profileView:{
    height: moderateScale(80),
    width: moderateScale(90),
    borderRadius: 80,
    borderWidth:1,
    borderColor: '#a29191',
  },
});

//   <Image source={require('./assets/images/avatar.png')} />