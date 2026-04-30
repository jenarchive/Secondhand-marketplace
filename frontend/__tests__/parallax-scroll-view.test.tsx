import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return Reanimated;
});

jest.mock('react-native-gesture-handler', () => ({
  GestureDetector: ({ children }: { children: React.ReactNode }) => children,
  Gesture: {
    Pan: () => ({
      onStart: function(fn: any) { this._onStart = fn; return this; },
      onUpdate: function(fn: any) { this._onUpdate = fn; return this; },
      onEnd: function(fn: any) { this._onEnd = fn; return this; },
    }),
  },
}));

jest.mock('@/components/themed-view', () => ({
  ThemedView: ({ children, style }: any) => {
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
  },
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

import ParallaxScrollView from '../components/parallax-scroll-view-horizontal';

describe('ParallaxScrollView (horizontal)', () => {
  it('renders without crashing', () => {
    expect(() =>
      render(
        <ParallaxScrollView>
          <Text>Card content</Text>
        </ParallaxScrollView>
      )
    ).not.toThrow();
  });

  it('renders with optional props', () => {
    const onCardDismiss = jest.fn();
    const onSwipeDirection = jest.fn();
    const onSwipeDown = jest.fn();

    expect(() =>
      render(
        <ParallaxScrollView
          onCardDismiss={onCardDismiss}
          onSwipeDirection={onSwipeDirection}
          onSwipeDown={onSwipeDown}
        >
          <Text>Swipeable card</Text>
        </ParallaxScrollView>
      )
    ).not.toThrow();
  });
});
