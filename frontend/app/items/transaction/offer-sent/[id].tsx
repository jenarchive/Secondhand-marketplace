import { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/use-theme-color';

const OFFER_SENT_DURATION_MS = 3000;

function firstParam(v: string | string[] | undefined): string | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v[0] : v;
}

export default function OfferSentScreen() {
  const params = useLocalSearchParams<{
    id: string | string[];
    offerPrice?: string | string[];
    transactionMethod?: string | string[];
    source?: string | string[];
    fromMarketplace?: string | string[];
    fromExplore?: string | string[];
    fromLikedItems?: string | string[];
  }>();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const subtextColor = useThemeColor({}, 'tabIconDefault');

  const translateY = useRef(new Animated.Value(40)).current;
  const translateX = useRef(new Animated.Value(-24)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  useEffect(() => {
    const idStr = firstParam(params.id);
    if (!idStr) return;

    const offerPrice = firstParam(params.offerPrice);
    const transactionMethod = firstParam(params.transactionMethod);
    const source = firstParam(params.source);
    const fromMarketplace = firstParam(params.fromMarketplace) ?? 'false';
    const fromExplore = firstParam(params.fromExplore) ?? 'false';
    const fromLikedItems = firstParam(params.fromLikedItems) ?? 'false';

    const t = setTimeout(() => {
      router.replace({
        pathname: '/items/chat/[id]',
        params: {
          id: idStr,
          sellerName: `User${idStr}`,
          fromTransaction: 'true',
          ...(transactionMethod ? { transactionMethod } : {}),
          ...(offerPrice ? { offerPrice } : {}),
          ...(source ? { source } : {}),
          fromMarketplace,
          fromExplore,
          fromLikedItems,
        },
      });
    }, OFFER_SENT_DURATION_MS);

    return () => clearTimeout(t);
  }, [
    params.id,
    params.offerPrice,
    params.transactionMethod,
    params.source,
    params.fromMarketplace,
    params.fromExplore,
    params.fromLikedItems,
    router,
  ]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-25deg', '0deg'],
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { backgroundColor }]}>
        <View style={styles.centerBlock}>
          <Animated.View
            style={[
              styles.iconWrap,
              {
                opacity,
                transform: [
                  { translateY },
                  { translateX },
                  { rotate: rotateInterpolate },
                ],
              },
            ]}
          >
            <Ionicons name="paper-plane-outline" size={72} color="#CCF1FF" />
          </Animated.View>
          <Text style={[styles.message, { color: textColor }]}>
            The seller has received your offer
          </Text>
          <Text style={[styles.hint, { color: subtextColor }]}>
            Opening chat with seller…
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 32,
  },
  centerBlock: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
  },
  iconWrap: {
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 26,
  },
  hint: {
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
});
