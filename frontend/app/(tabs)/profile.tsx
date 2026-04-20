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
    { id: 0, iconName: 'chatbubble-ellipses-outline' as const, label: "My Chats", next: require('../../assets/images/next.png'), link: "/items/your-chats" },
    { id: 1, iconName: 'pricetag-outline' as const, label: "My Listings", next: require('../../assets/images/next.png'), link: "/items/current-listing" },
    { id: 2, iconName: 'log-out-outline' as const, label: "Log Out", next: require('../../assets/images/next.png'), link: "/items/logout" },
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
                  <ThemedText type="defaultSemiBold" style={styles.userNameText}>
                    {username || 'Username'}
                  </ThemedText>
                  <View style={styles.userRatingRow}>
                    <View style={styles.userRatingStars}>
                      <Ionicons name="star" size={14} color="#FACC15" />
                      <Ionicons name="star" size={14} color="#FACC15" />
                      <Ionicons name="star" size={14} color="#FACC15" />
                      <Ionicons name="star" size={14} color="#FACC15" />
                      <Ionicons name="star" size={14} color="#FACC15" />
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
          ItemSeparatorComponent={() => <View style={{ height: 25 }} />}
          keyExtractor={(item) => item.id.toString()}
           renderItem={({ item }) => (
            <Link href={item.link as Href} asChild>
              <Pressable>
                <ThemedView style={styles.listRow}>
                  <View style={styles.listRowContent}>
                    <View style={[styles.listSide, styles.leadingIconSide]}>
                      <Ionicons name={item.iconName} size={30} color={iconColor} />
                    </View>
                    <View style={styles.listText}>
                      <ThemedText style={styles.listLabelText}>{item.label}</ThemedText>
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
    marginTop: 90,
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
    fontSize: 20,
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
    paddingTop: 32,
    paddingBottom: 24,
    width: 300,
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  listRow: {
    width: 300,
    borderRadius: 25,
    paddingHorizontal: 0,
  },
  listRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  listSide: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leadingIconSide: {
    paddingLeft: 10,
  },
  listText: {
    flex: 1,
    marginHorizontal: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listLabelText: {
    fontSize: 17,
    lineHeight: 22,
    textAlign: 'center',
  },
  listArrow: {
    height: 18,
    width: 18,
  },
});
