import { StyleSheet, View, Text } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ChatScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  return (
    <>
      <Stack.Screen options={{ title: 'Chat with seller' }} />
      <View style={[styles.screen, { backgroundColor }]}>
        <Text style={[styles.placeholder, { color: textColor }]}>
          Chat with seller (item #{params.id}) — coming soon
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholder: {
    fontSize: 15,
    textAlign: 'center',
  },
});
