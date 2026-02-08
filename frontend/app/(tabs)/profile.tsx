import { Image } from 'expo-image';
import { StyleSheet, Pressable, View, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <ThemedView style={styles.contentContainer}>

      {/* welcome header */}
      <ThemedView style={styles.headerContainer}>
        <ThemedText type="title">Welcome</ThemedText>
      </ThemedView>

      {/* login and sign up buttons */}
      <View style={styles.authContainer}>
        
        {/* Login Button -> Goes to /login */}
        <Link href="../auth/login" asChild>
          <Pressable style={styles.secondaryButton}>
            <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>Log In</ThemedText>
          </Pressable>
        </Link>

        {/* Sign Up Button -> Goes to /signup */}
        <Link href="../auth/signup" asChild>
          <Pressable style={styles.primaryButton}>
            <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>Sign Up</ThemedText>
          </Pressable>
        </Link>

      </View>

    </ThemedView>
  );
}

const colours = {
  container: '#25282B',
  button: '#28289D',
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  contentContainer: {
    flex: 1,
    padding: 24,
    gap: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },

  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },

  authContainer: {
    gap: 16,
    width: '100%'
  },

  primaryButton: {
    backgroundColor: colours.button,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },

  secondaryButton: {
    backgroundColor: colours.container,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },

  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});