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
import { Children, useRef } from 'react';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';
import { ThemedText } from './themed-text';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_WIDTH = SCREEN_WIDTH;
const CONTENT_HEIGHT = Math.min(SCREEN_WIDTH * (16 / 9), SCREEN_HEIGHT * 0.82);

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
  onCardDismiss?: () => void;
  onSwipeDirection?: (direction: 'left' | 'right') => void;
}>;

export default function ParallaxScrollView({
  children,
  onCardDismiss,
  onSwipeDirection,
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
      style={[styles.scrollView, { backgroundColor }]}
      scrollEventThrottle={8}
      onScroll={async (event) => {
        const x = event.nativeEvent.contentOffset.x;
        const swipeTrigger = 5;

        if (x > swipeTrigger && !hasLoggedRef.current) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          hasLoggedRef.current = true;
          hasExceededRef.current = true;
          onSwipeDirection?.('left');
        } else if (x < -swipeTrigger && !hasLoggedRef.current) {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          hasLoggedRef.current = true;
          hasExceededRef.current = true;
          onSwipeDirection?.('right');
        }
        //reset if user scrolls back
        if (x <= swipeTrigger && hasLoggedRef.current && x >= -swipeTrigger) {
          hasLoggedRef.current = false;
          hasExceededRef.current = false;
        }
      }}
      onScrollEndDrag={async (event) => {
        const x = event.nativeEvent.contentOffset.x;
        
        
        if (Math.abs(x) > 50) {
          console.log('Touch ended after scrolling more than 50px horizontally');
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          
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
  scrollView: {
    flex: 1,
  },
  content: {
    width: HEADER_WIDTH,
    height: CONTENT_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 24,
    gap: 16,
  },
});
