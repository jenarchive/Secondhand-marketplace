import type { PropsWithChildren, ReactElement } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 15;
const SWIPE_UP_THRESHOLD = 80;

export type ParallaxScrollViewRef = {
  triggerSwipe: (direction: 'left' | 'right') => void;
  resetPosition: () => void;
};

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: { dark: string; light: string };
  onCardDismiss?: (direction?: 'left' | 'right') => void;
  onCardWillDismiss?: (direction: 'left' | 'right') => void;
  onSwipeUp?: () => void;
}>;

const ParallaxScrollView = forwardRef<ParallaxScrollViewRef, Props>(function ParallaxScrollView({
  children,
  onCardDismiss,
  onCardWillDismiss,
  onSwipeUp,
}, ref) {
  const backgroundColor = useThemeColor({}, 'background');
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastX = useSharedValue(0);
  const lastY = useSharedValue(0);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const SWIPE_DURATION_RIGHT = 700;
  const SWIPE_DURATION_LEFT = 300;
  const SLIDE_IN_DURATION_RIGHT = 1000;

  useImperativeHandle(ref, () => ({
    triggerSwipe: (direction: 'left' | 'right') => {
      triggerHaptic();
      const targetX = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
      const duration = direction === 'right' ? SWIPE_DURATION_RIGHT : SWIPE_DURATION_LEFT;
      translateX.value = withTiming(targetX, { duration }, () => {
        if (onCardDismiss) runOnJS(onCardDismiss)(direction);
        translateX.value = direction === 'right'
          ? withTiming(0, { duration: SLIDE_IN_DURATION_RIGHT })
          : withSpring(0);
      });
    },
    resetPosition: () => {
      translateX.value = 0;
      translateY.value = 0;
    },
  }), [onCardDismiss]);

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    if (onCardDismiss) onCardDismiss(direction);
  };

  const handleFinalize = (x: number, y: number, didSucceed: boolean) => {
    if (!didSucceed) return;
    const isSwipeUp = y < -SWIPE_UP_THRESHOLD && Math.abs(y) > Math.abs(x);
    const isSwipeHorizontal = Math.abs(x) > SWIPE_THRESHOLD && Math.abs(x) > Math.abs(y);

    if (isSwipeUp && onSwipeUp) {
      triggerHaptic();
      onSwipeUp();
    } else if (isSwipeHorizontal && onCardDismiss) {
      triggerHaptic();
      const direction = x > 0 ? 'right' : 'left';
      onCardWillDismiss?.(direction);
      const targetX = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
      const duration = direction === 'right' ? SWIPE_DURATION_RIGHT : SWIPE_DURATION_LEFT;
      translateY.value = withSpring(0);
      translateX.value = withTiming(targetX, { duration }, () => {
        runOnJS(handleSwipeComplete)(direction);
        translateX.value = direction === 'right'
          ? withTiming(0, { duration: SLIDE_IN_DURATION_RIGHT })
          : withSpring(0);
      });
    } else {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      lastX.value = event.translationX;
      lastY.value = event.translationY;
    })
    .onFinalize((_e, didSucceed) => {
      runOnJS(handleFinalize)(lastX.value, lastY.value, didSucceed);
      if (!didSucceed) {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-10, 0, 10]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotateZ: `${rotate}deg` }
      ],
    };
  });

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.content, contentAnimatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </ThemedView>
  );
});

export default ParallaxScrollView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});