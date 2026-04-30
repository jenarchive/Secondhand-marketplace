import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import OfferAcceptedScreen from '../app/items/transaction/offer-accepted/[id]';
import { useLocalSearchParams, useRouter } from 'expo-router';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockCanGoBack = jest.fn();

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@/components/butterfly', () => ({
  Butterfly: ({ onFinish }: { onFinish: () => void }) => {
    const React = require('react');
    React.useEffect(() => {
      onFinish();
    }, [onFinish]);
    return null;
  },
}));

describe('OfferAcceptedScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: '10',
      source: 'explore',
      fromMarketplace: 'false',
      fromExplore: 'true',
      fromLikedItems: 'false',
      fromMyChatsList: 'false',
    });

    (useRouter as jest.Mock).mockReturnValue({
      replace: mockReplace,
      back: mockBack,
      canGoBack: mockCanGoBack,
    });

    mockCanGoBack.mockReturnValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the "Offer accepted!" title', () => {
    render(<OfferAcceptedScreen />);
    expect(screen.getByText('Offer accepted!')).toBeTruthy();
  });

  it('renders the subtitle message', () => {
    render(<OfferAcceptedScreen />);
    expect(screen.getByText('Taking you back to your transaction…')).toBeTruthy();
  });

  it('auto-navigates to transaction screen after the timeout', async () => {
    render(<OfferAcceptedScreen />);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/items/transaction/[id]',
        params: expect.objectContaining({ id: '10' }),
      })
    );
  });

  it('navigates back when canGoBack is true and fromMyChatsList is false', async () => {
    mockCanGoBack.mockReturnValue(true);
    render(<OfferAcceptedScreen />);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockBack).toHaveBeenCalled();
  });

  it('routes to transaction with fromMyChatsList when that param is true', async () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      id: '10',
      source: 'explore',
      fromMarketplace: 'false',
      fromExplore: 'true',
      fromLikedItems: 'false',
      fromMyChatsList: 'true',
    });

    render(<OfferAcceptedScreen />);

    await act(async () => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/items/transaction/[id]',
        params: expect.objectContaining({ fromMyChatsList: 'true' }),
      })
    );
  });
});
