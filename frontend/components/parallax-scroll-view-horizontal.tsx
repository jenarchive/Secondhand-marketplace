import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;
const TRIGGER_THRESHOLD = 10;

const SWIPE_UP_THRESHOLD = 80;

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: { dark: string; light: string };
  onCardDismiss?: (direction?: 'left' | 'right') => void;
  onSwipeDirection?: (direction: 'left' | 'right') => void;
  onSwipeUp?: () => void;
}>;

export default function ParallaxScrollView({
  children,
  onCardDismiss,
  onSwipeDirection,
  onSwipeUp,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const hasTriggeredHaptic = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;

      if (Math.abs(event.translationX) > TRIGGER_THRESHOLD && !hasTriggeredHaptic.value) {
        hasTriggeredHaptic.value = true;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
        if (onSwipeDirection) {
          runOnJS(onSwipeDirection)(event.translationX > 0 ? 'right' : 'left');
        }
      }
    })
    .onEnd((event) => {
      const isSwipeUp = event.translationY < -SWIPE_UP_THRESHOLD && Math.abs(event.translationY) > Math.abs(event.translationX);
      const isSwipeHorizontal = Math.abs(event.translationX) > SWIPE_THRESHOLD;

      if (isSwipeUp && onSwipeUp) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
        runOnJS(onSwipeUp)();
      } else if (isSwipeHorizontal) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
        const direction = event.translationX > 0 ? 'right' : 'left';
        if (onCardDismiss) runOnJS(onCardDismiss)(direction);
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      hasTriggeredHaptic.value = false;
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
}

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