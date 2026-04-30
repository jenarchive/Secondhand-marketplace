import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import RateAfterPaymentScreen from '../app/items/transaction/rate/[id]';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMyListings } from '@/contexts/MyListingsContext';

const mockReplace = jest.fn();
const mockUpdateItem = jest.fn();

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/MyListingsContext', () => ({
  useMyListings: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('expo-image', () => ({
  Image: () => null,
}));

const mockItem = {
  id: 8,
  title: 'Old Camera',
  description: 'Classic film camera',
  price: 150,
  image: 'https://example.com/camera.jpg',
  category: 'Electronics',
  location: 'Manchester',
};

const renderRate = (params: Partial<Record<string, string>> = {}) => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({
    id: '8',
    fromMyChatsList: 'false',
    ...params,
  });

  (useRouter as jest.Mock).mockReturnValue({
    replace: mockReplace,
  });

  (useMyListings as jest.Mock).mockReturnValue({
    items: [mockItem],
    updateItem: mockUpdateItem,
  });

  return render(<RateAfterPaymentScreen />);
};

describe('RateAfterPaymentScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the "Rate seller" header', () => {
    renderRate();
    expect(screen.getByText('Rate seller')).toBeTruthy();
  });

  it('renders the item title', () => {
    renderRate();
    expect(screen.getByText('Old Camera')).toBeTruthy();
  });

  it('renders the seller name in the subtitle', () => {
    renderRate();
    expect(screen.getByText(/Rate your transaction with User8/)).toBeTruthy();
  });

  it('renders the "Submit rating" button', () => {
    renderRate();
    expect(screen.getByText('Submit rating')).toBeTruthy();
  });

  it('renders review text input', () => {
    renderRate();
    expect(screen.getByPlaceholderText('Leave a short review (optional)')).toBeTruthy();
  });

  it('submits rating and navigates to rating-submitted screen', async () => {
    renderRate();

    await act(async () => {
      fireEvent.press(screen.getByText('Submit rating'));
    });

    expect(mockUpdateItem).toHaveBeenCalledWith(8, { rating: 5 });
    expect(mockReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/items/transaction/rating-submitted/[id]',
        params: expect.objectContaining({ id: '8', rating: '5' }),
      })
    );
  });

  it('passes fromMyChatsList param to rating-submitted screen', async () => {
    renderRate({ fromMyChatsList: 'true' });

    await act(async () => {
      fireEvent.press(screen.getByText('Submit rating'));
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.objectContaining({ fromMyChatsList: 'true' }),
      })
    );
  });
});
