import { useState } from 'react';
import { StyleSheet, Pressable, View, TextInput, ActivityIndicator, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';

const FLASK_SERVER_ADDRESS = 'http://18.133.255.151/test';
const BACK_BUTTON_BG = 'rgba(0,0,0,0.4)';

export default function SignUpScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const backgroundColor = useThemeColor({}, 'background');
  const { height: windowHeight } = useWindowDimensions();
  const formLift = Math.round(Math.min(200, windowHeight * 0.14));
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!username || !email || !password) {
      setError('All fields are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${FLASK_SERVER_ADDRESS}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Registration failed.');
        return;
      }
      const loginRes = await fetch(`${FLASK_SERVER_ADDRESS}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        setError(loginData.error ?? 'Login failed.');
        return;
      }
      login(loginData.access_token);
      router.replace('/(tabs)/profile');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.root, { backgroundColor }]}>
        <View style={[styles.header, { backgroundColor }]}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: BACK_BUTTON_BG }]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <ThemedView style={[styles.screen, { backgroundColor }]}>
          <View style={[styles.formCenter, { paddingBottom: formLift }]}>
            <View style={styles.form}>
            <ThemedText type="title" style={styles.title}>Sign Up</ThemedText>

            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#888"
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#888"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

            <Pressable style={styles.button} onPress={handleSignUp} disabled={loading}>
              {loading
                ? <ActivityIndicator color="#fff" />
                : <ThemedText type="defaultSemiBold" style={{ color: '#fff' }}>Sign Up</ThemedText>
              }
            </Pressable>
            </View>
          </View>
        </ThemedView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 100,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    bottom: 0,
    padding: 4,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 8,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  formCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    gap: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28289D',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  error: {
    color: '#e05',
    textAlign: 'center',
  },
});
