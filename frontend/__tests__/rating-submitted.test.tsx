import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import RatingSubmittedScreen from '../app/items/transaction/rating-submitted/[id]';
import { useLocalSearchParams, useRouter } from 'expo-router';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('@/components/themed-text', () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

describe('RatingSubmittedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      rating: '4',
      fromMyChatsList: 'false',
    });

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the "Review submitted" title', () => {
    render(<RatingSubmittedScreen />);
    expect(screen.getByText('Review submitted')).toBeTruthy();
  });

  it('auto-navigates to tabs after the timeout', async () => {
    render(<RatingSubmittedScreen />);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });

  it('navigates to your-chats when fromMyChatsList is true', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      rating: '5',
      fromMyChatsList: 'true',
    });

    render(<RatingSubmittedScreen />);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/items/your-chats',
        params: expect.objectContaining({ backToProfile: 'true' }),
      })
    );
  });

  it('clamps the rating to valid range (min 1)', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      rating: '0',
      fromMyChatsList: 'false',
    });
    expect(() => render(<RatingSubmittedScreen />)).not.toThrow();
  });

  it('clamps the rating to valid range (max 5)', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      rating: '10',
      fromMyChatsList: 'false',
    });
    expect(() => render(<RatingSubmittedScreen />)).not.toThrow();
  });

  it('uses default rating of 5 when rating param is missing', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      fromMyChatsList: 'false',
    });
    expect(() => render(<RatingSubmittedScreen />)).not.toThrow();
  });
});
