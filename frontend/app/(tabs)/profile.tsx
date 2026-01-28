import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, Dimensions, FlatList } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {

  // list of buttons below profile card
  const Data = [
    { id: 1, icon: require('../../assets/images/history.png'), label: "Purchase History", next: require('../../assets/images/chevron.png') },
    { id: 2, icon: require('../../assets/images/heart.png'), label: "Liked Items", next: require('../../assets/images/chevron.png') },
    { id: 3, icon: require('../../assets/images/list.png'), label: "Current Listing", next: require('../../assets/images/chevron.png') },
    { id: 4, icon: require('../../assets/images/notification.png'), label: "Notification", next: require('../../assets/images/chevron.png') },
    { id: 5, icon: require('../../assets/images/settings.png'), label: "Setting", next: require('../../assets/images/chevron.png') },
    { id: 6, icon: require('../../assets/images/out.png'), label: "Log Out", next: require('../../assets/images/chevron.png') },
  ];

  // handle press on profilecard
  const pressReviews = async () => {

  };

  return (
    <View style={styles.screen}>
      <View style={styles.mainContainer}>

        {/* avatar, name and email (with link to change) */}
        <Link href="../items/review" asChild>
          <Pressable style={styles.profileFrame}>
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
          </Pressable>
        </Link>

        {/* list of buttons that link to other tabs */}
        <FlatList
          data={Data}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
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
    paddingBottom: '21%',
  },

  mainContainer: {
    flex: 1,
    alignContent: 'center',
    paddingTop: '11.4%',
    alignItems: 'center',
    rowGap: '2%',
  },

  button:{
    width: '100%',
    borderColor: '#FFF',
    borderWidth: 1,
  },

  profileFrame: {
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: "center",
    alignContent: 'center',
    height: 200,
  },

  profileLeftHalf: {
    alignContent: 'center',
    alignItems: 'center',
    // borderColor: '#FFF',
    // borderWidth: 1,
  },

  userProfileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    gap: 63,
    marginTop: 0,
    backgroundColor: colours.container,
    padding: 35,
    paddingLeft: 50,
    borderRadius: 50,
    borderColor: '#cc1111',
    borderWidth: 1,
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

  listContainer: {
    paddingTop: 25,
    // paddingBottom: 40,
    flex: 1,
    borderColor: '#cc1111',
    borderWidth: 1,
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
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
    marginHorizontal: 20,
    borderWidth: 1
  },
});

