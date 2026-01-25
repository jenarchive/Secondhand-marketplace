import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_WIDTH = SCREEN_WIDTH;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      scrollOffset.value,
      [-HEADER_WIDTH, 0, HEADER_WIDTH],
      [10, 0, -10]
    );
    return {
      transform: [
        {rotateZ: `${rotate}deg`},
      ],
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
