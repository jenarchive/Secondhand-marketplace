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
            {/* <Image style = {styles.profilePhoto}
            source={require('../../assets/images/avatar.png')} />
            <View style={styles.profileTextContainer}>
              <ThemedText style={styles.profileUsername}> Username</ThemedText>
              <ThemedText style={styles.profileEmail}> Email </ThemedText>
            </View> */}
          {/* <Pressable onPress={handleUserPress}> */}
              <ThemedView style={styles.userProfileContainer}>
                <ThemedView style={styles.userProfileImage}>
                  <ThemedText type="defaultSemiBold">U</ThemedText>
                </ThemedView>
                <ThemedView style={styles.userMeta}>
                  <ThemedText type="defaultSemiBold">Username</ThemedText>
                  <ThemedText type="defaultSemiBold">Email</ThemedText>
                </ThemedView>
                <ThemedView style={styles.userRating} accessibilityLabel={`Rating ${4} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starIndex = i + 1;
                    const filled = starIndex <= Math.round(4);
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
              {/* </Pressable> */}
        </View>
        



        {/* reviews */}
          <View style={styles.options}>
            <ThemedText>
              Reviews
            </ThemedText>
          </View>

        {/* buttons below that link to different areas */}
        <View style={styles.rowsBelow}>
          {/* purchase history  */}
          <View style={styles.options}>
            <ThemedText>
              Purchase History
            </ThemedText>
          </View>

          {/* liked items */}
          <View style={styles.options}>
            <ThemedText >
              Liked Items
            </ThemedText>
          </View>

          {/* current listing (selling list)  */}
          <View style={styles.options}>
            <ThemedText>
              Current Listing
            </ThemedText>
          </View>

        </View>
        
        {/* settings and notifications */}
        <View>
          
          <View style={styles.options}>
            <ThemedText>
              Notification
            </ThemedText>
          </View>

          {/* settings */}
          <View style={styles.options}>
            <ThemedText>
              Settings
            </ThemedText>
          </View>
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
    paddingTop: '11.4%',
  },

  profileFrame:{
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: "center",
    // borderWidth: 1, 
    // borderColor: '#FFFFFF',
    padding: 30,
  },

  profilePhoto:{
    height:110,
    width:110,
    borderRadius: 90,
  },

  profileTextContainer:{
    flex:1,
    // borderWidth: 1,
    // borderColor: '#FFFFFF',
    paddingLeft: '10%',
    alignContent: "center",
    alignItems: "center",
  },

  profileUsername:{
    fontSize: 16,
    fontWeight: "500",
  },

  profileEmail:{
    fontSize: 16,
    fontWeight: "500",
  },
  rowsBelow:{
    paddingTop: "10%",
    // flexDirection: "row",
  },

  options:{
    height: 70,
    // width: 130, 
    // color: '#a29191',
    backgroundColor: '#a29191',
    borderWidth: 1,
    alignItems: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
  },
  
  userProfileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 0,
    backgroundColor: colours.container,
    padding: 12,
    borderRadius: 16,
    borderColor: '#FFFFFF',
    borderWidth: 1,
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
  },
});

