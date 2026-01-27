import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.mainContainer}>

        {/* avatar, name and email (with link to change) */}
        <View style={styles.profileFrame}>
          {/* <View style ={styles.profileView}>  */}
            <Image style = {styles.profilePhoto}
            source={require('../../assets/images/avatar.png')} />
            <View style={styles.profileTextContainer}>
              {/* <View style={styles.profileUsername}> */}
                <ThemedText style={styles.profileUsername}> Username</ThemedText>
              {/* </View> */}
              {/* <View style={styles.profileEmail}> */}
                <ThemedText style={styles.profileEmail}> Email </ThemedText>
              {/* </View> */}
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

      
      </View>
    </View>
  );
}

const colours = {
  container: '#191C1F',
};

const styles = StyleSheet.create({
  screen:{
    flex:1,
    backgroundColor: '#191C1F',
    paddingLeft: '7%',
    paddingRight: '7%',
    paddingTop: '15.4%',
    paddingBottom: '24%',
  },
  mainContainer:{
    flex:1, 
    alignContent: 'center',
    borderWidth: 1,
    borderColor: '#f60606',
    paddingTop: '11.4%',
  },
  profileFrame:{
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: "center",
    height: 170,
    width: 300, 
    borderWidth: 1, 
    borderColor: '#FFFFFF',
    padding: 30,
  },
  profileView:{
    // flex:1,
    // borderRadius:  110,
    borderWidth: 1,
    borderColor: '#17a150',
  },
  profilePhoto:{
    height:110,
    width:110,
    borderRadius: 90,
  },
  profileTextContainer:{
    flex:1,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  profileUsername:{
    fontSize: 16,
    fontWeight: "500",
    height: 44,
    width: 100,
    // paddingTop: 50,
    // paddingLeft: 170,
    backgroundColor: '#a29191'
  },
  profileEmail:{
    height: 44,
    width: 100,
    // paddingTop: 70,
    // paddingLeft: 170,
    backgroundColor: '#a29191'
  },
  options:{
    height: 70,
    width: 130, 
    // color: '#a29191',
    backgroundColor: '#a29191'
  },
});

