import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, FlatList } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link, Href } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

const FLASK_SERVER_ADDRESS = 'http://18.133.255.151/test';

function AuthGate() {
  return (
    <ThemedView style={gateStyles.contentContainer}>
      <ThemedView style={gateStyles.headerContainer}>
        <ThemedText type="title">Welcome</ThemedText>
      </ThemedView>
      <View style={gateStyles.authContainer}>
        <Link href="../auth/login" asChild>
          <Pressable style={gateStyles.secondaryButton}>
            <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>Log In</ThemedText>
          </Pressable>
        </Link>
        <Link href="../auth/signup" asChild>
          <Pressable style={gateStyles.primaryButton}>
            <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>Sign Up</ThemedText>
          </Pressable>
        </Link>
      </View>
    </ThemedView>
  );
}

export default function HomeScreen() {
  const { isLoggedIn, token } = useAuth();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? '#fff' : '#000';
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const { logout } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !token) return;
    fetch(`${FLASK_SERVER_ADDRESS}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) { logout(); return null; }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.username) setUsername(data.username);
        if (data.email) setEmail(data.email);
      })
      .catch(() => {});
  }, [isLoggedIn, token]);

  if (!isLoggedIn) {
    return <AuthGate />;
  }

  const Data = [
    { id: 0, iconName: 'notifications-outline' as const, label: "Notification", next: require('../../assets/images/next.png'), link: "/items/notification" },
    { id: 1, iconName: 'pricetag-outline' as const, label: "My Listings", next: require('../../assets/images/next.png'), link: "/items/current-listing" },
    { id: 2, iconName: 'settings-outline' as const, label: "Settings", next: require('../../assets/images/next.png'), link: "/items/setting" },
    { id: 3, iconName: 'log-out-outline' as const, label: "Log Out", next: require('../../assets/images/next.png'), link: "/items/logout" },
  ];

  return (
    <ThemedView style={styles.screen}>
      <View style={styles.mainContainer}>

        <Link href="../items/edit-profile" asChild>
          <Pressable style={styles.profileFrame}>
            <ThemedView style={styles.userProfileContainer}>
                <ThemedView style={styles.userProfileImage}>
                  <ThemedText type="defaultSemiBold">{username ? username[0].toUpperCase() : 'U'}</ThemedText>
                </ThemedView>
                <ThemedView style={styles.userMeta}>
                  <ThemedText type="defaultSemiBold" style={styles.userNameText}>Username</ThemedText>
                  <View style={styles.userRatingRow}>
                    <View style={styles.userRatingStars}>
                      <Ionicons name="star" size={12} color="#FACC15" />
                      <Ionicons name="star" size={12} color="#FACC15" />
                      <Ionicons name="star" size={12} color="#FACC15" />
                      <Ionicons name="star" size={12} color="#FACC15" />
                      <Ionicons name="star" size={12} color="#FACC15" />
                    </View>
                  </View>
                </ThemedView>
                <View style={styles.userCardArrowWrap}>
                  <Ionicons name="chevron-forward" size={26} color="#9CA3AF" />
                </View>
            </ThemedView>
          </Pressable>
        </Link>

        <FlatList
          data={Data}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 60 }} />}
          keyExtractor={(item) => item.id.toString()}
           renderItem={({ item }) => (
            <Link href={item.link as Href} asChild>
              <Pressable>
                <ThemedView style={styles.listRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <View style={styles.listSide}>
                      <Ionicons name={item.iconName} size={30} color={iconColor} />
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

const gateStyles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 24,
    gap: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  authContainer: {
    gap: 16,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#28289D',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: '#25282B',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

const colours = {
  container: '#191C1F',
  cardBorder: '#FFFFFF',
  avatarBg: '#1E3A8A',
};

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
    justifyContent: 'center',
    width: '100%',
    height: 200,
  },
  userProfileContainer: {
    width: '88%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 30,
    marginTop: 0,
    backgroundColor: colours.container,
    paddingVertical: 35,
    paddingLeft: 36,
    paddingRight: 16,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: colours.cardBorder,
  },
  userProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: colours.avatarBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMeta: {
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  userNameText: {
    lineHeight: 22,
  },
  userRatingRow: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  userRatingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  userCardArrowWrap: {
    marginLeft: 'auto',
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
