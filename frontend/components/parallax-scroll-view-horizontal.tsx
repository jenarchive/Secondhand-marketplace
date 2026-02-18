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

type Props = PropsWithChildren<{
  headerImage?: ReactElement;
  headerBackgroundColor?: { dark: string; light: string };
  onCardDismiss?: () => void;
  onSwipeDirection?: (direction: 'left' | 'right') => void;
}>;

export default function ParallaxScrollView({
  children,
  onCardDismiss,
  onSwipeDirection,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const translateX = useSharedValue(0);
  const hasTriggeredHaptic = useSharedValue(false);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;

      if (Math.abs(event.translationX) > TRIGGER_THRESHOLD && !hasTriggeredHaptic.value) {
        hasTriggeredHaptic.value = true;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
        if (onSwipeDirection) {
          runOnJS(onSwipeDirection)(event.translationX > 0 ? 'right' : 'left');
        }
      }
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Dismiss
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
        if (onCardDismiss) runOnJS(onCardDismiss)();
      }

      translateX.value = withSpring(0);
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});