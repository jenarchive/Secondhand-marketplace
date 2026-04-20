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

function firstParam(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default function OfferAcceptedScreen() {
  const params = useLocalSearchParams<{
    id: string | string[];
    source?: string | string[];
    fromMarketplace?: string | string[];
    fromExplore?: string | string[];
    fromLikedItems?: string | string[];
  }>();
  const router = useRouter();
  const id = firstParam(params.id);
  const backgroundColor = useThemeColor({}, 'background');
  const subtextColor = useThemeColor({}, 'tabIconDefault');

  const [butterflyIds, setButterflyIds] = useState(() => {
    const base = Date.now();
    return [base, base + 1, base + 2, base + 3];
  });

  const removeButterfly = useCallback((bid: number) => {
    setButterflyIds((prev) => prev.filter((x) => x !== bid));
  }, []);

  useEffect(() => {
    if (!id) return;
    const t = setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
        return;
      }
      const source = firstParam(params.source);
      router.replace({
        pathname: '/items/transaction/[id]',
        params: {
          id: String(id),
          ...(source ? { source } : {}),
          fromMarketplace: firstParam(params.fromMarketplace) ?? 'false',
          fromExplore: firstParam(params.fromExplore) ?? 'false',
          fromLikedItems: firstParam(params.fromLikedItems) ?? 'false',
        },
      });
    }, AUTO_NAV_MS);
    return () => clearTimeout(t);
  }, [id, router, params.source, params.fromMarketplace, params.fromExplore, params.fromLikedItems]);

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
          {butterflyIds.map((bid, i) => (
            <Butterfly
              key={bid}
              direction="right"
              startY={CENTER_Y}
              onFinish={() => removeButterfly(bid)}
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
