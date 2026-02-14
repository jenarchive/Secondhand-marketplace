import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const Data = [
    { id: 1, icon: require('../../assets/images/heart.png'), label: "Liked Items", next: require('../../assets/images/next.png'), link: "/items/liked-items" },
    { id: 2, icon: require('../../assets/images/settings.png'), label: "Setting", next: require('../../assets/images/next.png'), link: "/items/setting" },
    { id: 3, icon: require('../../assets/images/door.png'), label: "Log Out", next: require('../../assets/images/next.png'), link: "/items/logout" },
  ];

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.mainContainer}>

        {/* avatar, name and email (with link to change) */}
        <Link href="../items/edit-profile" asChild>
          <Pressable style={styles.profileFrame}>
            <ThemedView style={styles.userProfileContainer}>
                <ThemedView style={styles.userProfileImage}>
                  <ThemedText type="defaultSemiBold">U</ThemedText>
                </ThemedView>
                <ThemedView style={styles.userMeta}>
                  <ThemedText type="defaultSemiBold">Username</ThemedText>
                  <ThemedText type="defaultSemiBold">Email</ThemedText>
                </ThemedView>
            </ThemedView>
          </Pressable>
        </Link>

        <FlatList
          data={Data}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
          keyExtractor={(item) => item.id.toString()}
           renderItem={({ item }) => (
            <Link href={item.link} asChild>
              <Pressable>
                <ThemedView style={styles.listRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.listSide}>
                      <Image style={styles.listIcon} source={item.icon} />
                    </View>
                    <View style={styles.listText}>
                      <ThemedText>{item.label}</ThemedText>
                    </View>
                    <View style={styles.listSide}>
                      <Image style={styles.listArrow} source={item.next} />
                    </View>
                  </View>
                </ThemedView>
              </Pressable>
            </Link>
          )}
        />
      </View>
    </ThemedView>

  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: '5%',
    paddingTop: '15.4%',
    paddingBottom: '21%',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    rowGap: '2%',
  },
  profileFrame: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: 'center',
    paddingHorizontal: '5%',
    height: 200,
  },
  profileLeftHalf: {
    alignItems: 'center',
  },
  userProfileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    gap: 40,
    marginTop: 0,
    backgroundColor: colours.container,
    padding: 35,
    paddingLeft: 50,
    borderRadius: 50,
    shadowColor: '#e6e6e6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
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
    flex: 1,
    alignItems: 'center',
  },
  userRating: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 60,
    flex: 1,
    width: 300,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 50,
  },
  listRow: {
    width: 300,
    borderRadius: 25,
  },
  listSide: {
    height: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listIcon: {
    height: 30,
    width: 30,
  },
  listText: {
    flex: 4,
    marginHorizontal: 25,
    alignContent: 'center',
  },

  listArrow: {
    height: 15,
    width: 15,
  },
});
