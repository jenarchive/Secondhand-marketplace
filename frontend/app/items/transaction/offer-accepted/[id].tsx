import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Butterfly } from '@/components/butterfly';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CENTER_Y = SCREEN_HEIGHT / 2 - 28;
const AUTO_NAV_MS = 5000;
const BUTTERFLY_DURATION = 4200;
const TITLE_ORANGE = '#FF9500';

type ButterflyRow = { id: number; direction: 'left' | 'right' };

export default function OfferAcceptedScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const backgroundColor = useThemeColor({}, 'background');
  const subtextColor = useThemeColor({}, 'tabIconDefault');

  const [butterflies, setButterflies] = useState<ButterflyRow[]>(() => {
    const base = Date.now();
    return Array.from({ length: 4 }, (_, i) => ({
      id: base + i,
      direction: 'right' as const,
    }));
  });

  const removeButterfly = useCallback((bid: number) => {
    setButterflies((prev) => prev.filter((b) => b.id !== bid));
  }, []);

  useEffect(() => {
    if (!id) return;
    const t = setTimeout(() => {
      router.replace({ pathname: '/items/transaction/[id]', params: { id: String(id) } });
    }, AUTO_NAV_MS);
    return () => clearTimeout(t);
  }, [id, router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { backgroundColor }]}>
        <View style={styles.messageBlock} pointerEvents="none">
          <Text style={[styles.title, { color: TITLE_ORANGE }]}>Offer accepted!</Text>
          <Text style={[styles.subtitle, { color: subtextColor }]}>
            Taking you back to your transaction…
          </Text>
        </View>

        <View style={styles.butterflyOverlay} pointerEvents="none">
          {butterflies.map((b, i) => (
            <Butterfly
              key={b.id}
              direction={b.direction}
              startY={CENTER_Y}
              onFinish={() => removeButterfly(b.id)}
              clusterIndex={i}
              duration={BUTTERFLY_DURATION}
            />
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  messageBlock: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  butterflyOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
});
