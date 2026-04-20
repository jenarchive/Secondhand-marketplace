import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

function firstParam(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default function RatingSubmittedScreen() {
  const params = useLocalSearchParams<{ rating?: string; fromMyChatsList?: string | string[] }>();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const rating = Math.min(5, Math.max(1, Number(params.rating ?? 5)));
  const returnToMyChats = firstParam(params.fromMyChatsList) === 'true';

  useEffect(() => {
    const timer = setTimeout(() => {
      if (returnToMyChats) {
        router.replace({
          pathname: '/items/your-chats',
          params: { backToProfile: 'true' },
        } as any);
      } else {
        router.replace('/(tabs)');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, returnToMyChats]);

  return (
    <View style={[styles.screen, { backgroundColor }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <View style={styles.iconWrap}>
          <Ionicons name="checkmark" size={34} color="#FFFFFF" />
        </View>
        <ThemedText style={styles.title}>Review submitted</ThemedText>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((value) => (
            <Ionicons
              key={value}
              name={value <= rating ? 'star' : 'star-outline'}
              size={28}
              color="#FACC15"
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 23,
    fontWeight: '700',
    lineHeight: 33,
    paddingTop: 2,
    marginBottom: 8,
  },
  starsRow: {
    marginTop: 8,
    flexDirection: 'row',
    gap: 8,
  },
});
