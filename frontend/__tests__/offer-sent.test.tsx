import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import OfferSentScreen from '../app/items/transaction/offer-sent/[id]';
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

describe('OfferSentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: '7',
      offerPrice: '120',
      transactionMethod: 'Delivery',
      source: 'marketplace',
      fromMarketplace: 'true',
      fromExplore: 'false',
      fromLikedItems: 'false',
      fromMyChatsList: 'false',
    });

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the "offer received" message', () => {
    render(<OfferSentScreen />);
    expect(screen.getByText('The seller has received your offer')).toBeTruthy();
  });

  it('renders the "opening chat" hint', () => {
    render(<OfferSentScreen />);
    expect(screen.getByText('Opening chat with seller…')).toBeTruthy();
  });

  it('auto-navigates to chat screen after the timeout', async () => {
    render(<OfferSentScreen />);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/items/chat/[id]',
        params: expect.objectContaining({
          id: '7',
          offerPrice: '120',
          transactionMethod: 'Delivery',
          fromTransaction: 'true',
          fromMarketplace: 'true',
          fromExplore: 'false',
          fromLikedItems: 'false',
        }),
      })
    );
  });

  it('includes fromMyChatsList in navigation params when set to true', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: '7',
      offerPrice: '80',
      transactionMethod: 'Collection',
      source: 'explore',
      fromMarketplace: 'false',
      fromExplore: 'true',
      fromLikedItems: 'false',
      fromMyChatsList: 'true',
    });

    render(<OfferSentScreen />);

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({ fromMyChatsList: 'true' }),
      })
    );
  });
});
