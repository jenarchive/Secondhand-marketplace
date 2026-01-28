import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, Dimensions, FlatList } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {

  const Data = [
    { id: 1, icon: require('../../assets/images/history.png'), label: "Purchase History", next: require('../../assets/images/chevron.png') },
    { id: 2, icon: require('../../assets/images/heart.png'), label: "Liked Items", next: require('../../assets/images/chevron.png') },
    { id: 3, icon: require('../../assets/images/list.png'), label: "Current Listing", next: require('../../assets/images/chevron.png') },
    { id: 4, icon: require('../../assets/images/notification.png'), label: "Notification", next: require('../../assets/images/chevron.png') },
    { id: 5, icon: require('../../assets/images/settings.png'), label: "Setting", next: require('../../assets/images/chevron.png') },
    { id: 6, icon: require('../../assets/images/out.png'), label: "Log Out", next: require('../../assets/images/chevron.png') },
  ];

  return (
    <View style={styles.screen}>
      <View style={styles.mainContainer}>

        {/* avatar, name and email (with link to change) */}
        <View style={styles.profileFrame}>
          {/* <Pressable onPress={handleUserPress}> */}
          <ThemedView style={styles.userProfileContainer}>
            <View style={styles.profileLeftHalf}>
              <ThemedView style={styles.userProfileImage}>
                <ThemedText type="defaultSemiBold">U</ThemedText>
              </ThemedView>
              <ThemedView style={styles.userMeta}>
                <ThemedText type="defaultSemiBold">Username</ThemedText>
                <ThemedText type="defaultSemiBold">Email</ThemedText>
              </ThemedView>
            </View>

            <View>
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
              <View style={{ alignContent: 'center', alignItems: 'center' }}>
                <ThemedText>
                  8 Reviews
                </ThemedText>
              </View>
            </View>
          </ThemedView>
          {/* </Pressable> */}
        </View>

        <FlatList
          data={Data}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={()=><View style={{height: 30}}/>}
          keyExtractor={(item) => item.id.toString()} 
          renderItem={({ item }) => {
            return (
              <View style={{ flexDirection: "row", alignItems: "center", }}>
                <View style={styles.listSide}>
                  <Image style={styles.listIcon}
                    source={item.icon} />
                </View>
                <View style={styles.listText}>
                  <ThemedText>
                    {item.label}
                  </ThemedText>
                </View>
                <View style={styles.listSide}>
                  <Image style={styles.listIcon}
                    source={item.next} />
                </View>
              </View>
            )
          }}
        />


        {/* buttons below that link to different areas
        <View style={styles.rowsBelow}>
          <View style={styles.options}>
            <ThemedText>
              Purchase History
            </ThemedText>
          </View>

          <View style={styles.options}>
            <ThemedText >
              Liked Items
            </ThemedText>
          </View>

          <View style={styles.options}>
            <ThemedText>
              Current Listing
            </ThemedText>
          </View>

        </View>
        
        <View>
          
          <View style={styles.options}>
            <ThemedText>
              Notification
            </ThemedText>
          </View>

          <View style={styles.options}>
            <ThemedText>
              Settings
            </ThemedText>
          </View>
        </View> */}


      </View>
    </View>
  );
}

const colours = {
  container: '#191C1F',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#191C1F',
    paddingLeft: '7%',
    paddingRight: '7%',
    paddingTop: '15.4%',
    paddingBottom: '24%',
  },

  mainContainer: {
    flex: 1,
    alignContent: 'center',
    paddingTop: '11.4%',
    alignItems: 'center',
  },

  profileFrame: {
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: "center",
    alignContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    height: 200,
  },

  profileLeftHalf: {
    alignContent: 'center',
    alignItems: 'center',
    // borderColor: '#FFF',
    // borderWidth: 1,
  },

  rowsBelow: {
    paddingTop: "10%",
    // flexDirection: "row",
  },

  options: {
    height: 70,
    backgroundColor: '#a29191',
    borderWidth: 1,
    alignItems: 'center',
    alignContent: 'center',
    flexWrap: 'wrap',
  },

  userProfileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 63,
    marginTop: 0,
    backgroundColor: colours.container,
    padding: 35,
    paddingLeft: 50,
    borderRadius: 16,
    // borderColor: '#cc1111',
    // borderWidth: 1,
  },

  userProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userMeta: {
    backgroundColor: 'transparent',
    // marginLeft: 12,
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
  },

  userRating: {
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // borderColor: '#cc1111',
    // borderWidth: 1,
  },

  listContainer:{
    paddingTop: 40,
    flex: 1,
    borderColor: '#cc1111',
    borderWidth: 1,
    alignContent: 'center',
  },

  listSide: {
    height: 40, 
    width: 40,
    backgroundColor: '#aeabab',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  listIcon: {
    height: 30,
    width: 30,
  },

  listText: {
    width: '60%',
    marginHorizontal: 20
  },
});

