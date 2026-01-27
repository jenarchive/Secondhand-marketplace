import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale, vertialscale } from "../../styles/scaling";


const { height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.mainContainer}>

    {/* avatar, name and email (with link to change) */}
    <View style={styles.profileFrame}>
      <View style ={styles.profileView}> 
        <Image 
        style = {styles.profilePhoto}
        source={require('../../assets/images/avatar.png')} />
        <View style={styles.profileUsername}>
          <ThemedText>
            Username
          </ThemedText>
        </View>
        <View style={styles.profileEmail}>
          <ThemedText>
            Email
          </ThemedText>
        </View>
      </View>
    </View>
    
    {/* purchase history  */}
    <View style={styles.options}>
      <ThemedText>
        purchase history
      </ThemedText>
    </View>

    {/* liked items */}
    <View style={styles.options}>
      <ThemedText >
        liked items
      </ThemedText>
    </View>

    {/* reviews */}
    <View style={styles.options}>
      <ThemedText>
        reviews
      </ThemedText>
    </View>

    {/* current listing (selling list)  */}
    <View style={styles.options}>
      <ThemedText>
        current listing
      </ThemedText>
    </View>

    {/* settings */}
    <View style={styles.options}>
      <ThemedText>
        settings
      </ThemedText>
    </View>

    </SafeAreaView>
  );
}

const colours = {
  container: '#191C1F',
};

const styles = StyleSheet.create({
  mainContainer:{
    flex:1, 
    paddingLeft: moderateScale(51),
    paddingRight: moderateScale(51),
    backgroundColor: colours.container,
  },
  profileFrame:{
    height: moderateScale(170),
    width: moderateScale(300),
    backgroundColor: '#FFFFFF',
    paddingTop: moderateScale(100),
    // paddingLeft: moderateScale(51),
  },
  profilePhoto:{
    height: moderateScale(110),
    width: moderateScale(110),
    borderRadius:  moderateScale(110),
    // paddingTop: moderateScale(30),
    // paddingLeft: moderateScale(30),
  },
  profileView:{
    height: moderateScale(110),
    width: moderateScale(110),
    paddingTop: moderateScale(30),
    paddingLeft: moderateScale(30),
    borderRadius:  moderateScale(110),
  },
  profileUsername:{
    height: moderateScale(44),
    width: moderateScale(100),
    paddingTop: moderateScale(50),
    paddingLeft: moderateScale(170),
    backgroundColor: '#a29191'
  },
  profileEmail:{
    height: moderateScale(44),
    width: moderateScale(100),
    paddingTop: moderateScale(70),
    paddingLeft: moderateScale(170),
    backgroundColor: '#a29191'
  },
  options:{
    height: moderateScale(70),
    width: moderateScale(130), 
    // color: '#a29191',
    backgroundColor: '#a29191'
  },
});

