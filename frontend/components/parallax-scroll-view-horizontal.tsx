import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useRef } from 'react';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_WIDTH = SCREEN_WIDTH;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  onCardDismiss?: () => void;
}>;

export default function ParallaxScrollView({
  children,
  onCardDismiss,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  // Prevent console spam
  const hasLoggedRef = useRef(false);
  // Track whether the user has crossed the threshold during the current gesture
  const hasExceededRef = useRef(false);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      scrollOffset.value,
      [-HEADER_WIDTH, 0, HEADER_WIDTH],
      [10, 0, -10]
    );

    return {
      transform: [{ rotateZ: `${rotate}deg` }],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      horizontal
      decelerationRate="normal"
      showsHorizontalScrollIndicator={false}
      style={{ backgroundColor }}
      scrollEventThrottle={16}
      onScroll={async (event) => {
        const x = event.nativeEvent.contentOffset.x;

        if (x > 50 && !hasLoggedRef.current) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          console.log('Scrolled more than 50px horizontally');
          hasLoggedRef.current = true;
          hasExceededRef.current = true;
        }else if (x < -50 && !hasLoggedRef.current) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          
          console.log('Scrolled less than -50px horizontally');
          hasLoggedRef.current = true;
          hasExceededRef.current = true;
        }
        //reset if user scrolls back
        if (x <= 50 && hasLoggedRef.current && x >= -50) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          
          hasLoggedRef.current = false;
          hasExceededRef.current = false;
        }
        
      }}
      onScrollEndDrag={(event) => {
        const x = event.nativeEvent.contentOffset.x;
        
        if (Math.abs(x) > 50) {
          console.log('Touch ended after scrolling more than 50px horizontally');
          
          onCardDismiss?.();
        }
        
        if (hasExceededRef.current) {
          hasExceededRef.current = false;
        }
      }}
    >
      <Animated.View style={contentAnimatedStyle}>
        <ThemedView style={styles.content}>
          {children}
        </ThemedView>
      </Animated.View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    width: HEADER_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 64,
    paddingBottom: 32,
    aspectRatio: 9 / 16,
    gap: 16,
  },
});
