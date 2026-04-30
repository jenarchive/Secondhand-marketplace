import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import TransactionScreen from '../app/items/transaction/[id]';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMyListings } from '@/contexts/MyListingsContext';
import {
  getOfferForItem,
  getAcceptedOfferItemPrice,
  hasSentOfferForItem,
  markOfferSentForItem,
} from '@/store/transactionStore';
import { markItemPaidSold, markPendingMeetupReservation } from '@/store/pendingMeetupStore';

const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockAddPurchaseChatEntry = jest.fn();

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/MyListingsContext', () => ({
  useMyListings: jest.fn(),
}));

jest.mock('@/store/transactionStore', () => ({
  getOfferForItem: jest.fn().mockReturnValue(''),
  setOfferForItem: jest.fn(),
  getAcceptedOfferItemPrice: jest.fn().mockReturnValue(undefined),
  hasSentOfferForItem: jest.fn().mockReturnValue(false),
  markOfferSentForItem: jest.fn(),
}));

jest.mock('@/store/pendingMeetupStore', () => ({
  markItemPaidSold: jest.fn(),
  markPendingMeetupReservation: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'light',
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('expo-image', () => ({
  Image: () => null,
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, []);
  },
}));

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

const mockItem = {
  id: 5,
  title: 'Test Guitar',
  description: 'Electric guitar in good condition',
  price: 200,
  image: 'https://example.com/guitar.jpg',
  category: 'Musical Instruments',
  location: 'London',
};

const renderTransaction = (params: Partial<Record<string, string>> = {}) => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({
    id: '5',
    source: 'marketplace',
    fromMarketplace: 'true',
    fromExplore: 'false',
    fromLikedItems: 'false',
    fromMyChatsList: 'false',
    ...params,
  });

  (useRouter as jest.Mock).mockReturnValue({
    replace: mockReplace,
    push: mockPush,
  });

  (useMyListings as jest.Mock).mockReturnValue({
    items: [mockItem],
    addPurchaseChatEntry: mockAddPurchaseChatEntry,
  });

  return render(<TransactionScreen />);
};

describe('TransactionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getOfferForItem as jest.Mock).mockReturnValue('');
    (getAcceptedOfferItemPrice as jest.Mock).mockReturnValue(undefined);
    (hasSentOfferForItem as jest.Mock).mockReturnValue(false);
  });

  it('renders the transaction screen with item details', () => {
    renderTransaction();
    expect(screen.getByText('Transaction')).toBeTruthy();
    expect(screen.getByText('Transaction method')).toBeTruthy();
    expect(screen.getByText('Test Guitar')).toBeTruthy();
    expect(screen.getByText('Delivery')).toBeTruthy();
    expect(screen.getByText('Pay now')).toBeTruthy();
  });

  it('shows delivery address input by default', () => {
    renderTransaction();
    expect(screen.getByPlaceholderText('Enter postcode')).toBeTruthy();
  });

  it('switches to Collection/Meet-up method', async () => {
    renderTransaction();

    await act(async () => {
      fireEvent.press(screen.getByText('Meet-up'));
    });

    expect(screen.getByPlaceholderText('e.g. Station, cafe name')).toBeTruthy();
    expect(screen.getByText('Reserve item')).toBeTruthy();
  });

  it('shows the offer input section with list price', () => {
    renderTransaction();
    expect(screen.getByPlaceholderText('Your offer')).toBeTruthy();
    expect(screen.getByText('Send offer')).toBeTruthy();
    expect(screen.getByText(/List price/)).toBeTruthy();
  });

  it('shows alert when trying to send an empty offer', async () => {
    renderTransaction();

    await act(async () => {
      fireEvent.press(screen.getByText('Send offer'));
    });

    expect(Alert.alert).toHaveBeenCalledWith('Enter your offer', expect.any(String));
  });

  it('shows alert when offer equals the list price', async () => {
    renderTransaction();

    fireEvent.changeText(screen.getByPlaceholderText('Your offer'), '200');

    await act(async () => {
      fireEvent.press(screen.getByText('Send offer'));
    });

    expect(Alert.alert).toHaveBeenCalledWith('Same as list price', expect.any(String));
  });

  it('sends a valid offer and navigates to offer-sent screen', async () => {
    renderTransaction();

    fireEvent.changeText(screen.getByPlaceholderText('Your offer'), '150');

    await act(async () => {
      fireEvent.press(screen.getByText('Send offer'));
    });

    expect(markOfferSentForItem).toHaveBeenCalledWith(5);
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/items/transaction/offer-sent/[id]',
        params: expect.objectContaining({ id: '5', offerPrice: '150' }),
      })
    );
  });

  it('navigates to chat with seller', async () => {
    renderTransaction();

    await act(async () => {
      fireEvent.press(screen.getByText('Chat with seller'));
    });

    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/items/chat/[id]',
        params: expect.objectContaining({ id: '5', fromTransaction: 'true' }),
      })
    );
  });

  it('pays with card, marks item sold, and navigates to rate screen', async () => {
    renderTransaction();

    await act(async () => {
      fireEvent.press(screen.getByText('Pay now'));
    });

    expect(markItemPaidSold).toHaveBeenCalledWith(5);
    expect(mockAddPurchaseChatEntry).toHaveBeenCalledWith(5);
    expect(mockPush).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/items/transaction/rate/[id]',
      })
    );
  });

  it('reserves item via collection and navigates to tabs', async () => {
    renderTransaction();

    await act(async () => {
      fireEvent.press(screen.getByText('Meet-up'));
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Reserve item'));
    });

    expect(markPendingMeetupReservation).toHaveBeenCalledWith(5);
    expect(mockAddPurchaseChatEntry).toHaveBeenCalledWith(5);
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)');
  });

  it('reserves item and returns to chats list when fromMyChatsList is true', async () => {
    renderTransaction({ fromMyChatsList: 'true' });

    await act(async () => {
      fireEvent.press(screen.getByText('Meet-up'));
    });

    await act(async () => {
      fireEvent.press(screen.getByText('Reserve item'));
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: '/items/your-chats',
      })
    );
  });

  it('shows total payment including delivery fee for Delivery method', () => {
    renderTransaction();
    expect(screen.getByText(/Total payment/)).toBeTruthy();
    expect(screen.getByText(/£2.50/)).toBeTruthy();
  });

  it('shows Free delivery fee for Collection method', async () => {
    renderTransaction();

    await act(async () => {
      fireEvent.press(screen.getByText('Meet-up'));
    });

    const freeTexts = screen.getAllByText('Free');
    expect(freeTexts.length).toBeGreaterThanOrEqual(1);
  });

  it('hides Send offer button when offer has already been sent', () => {
    (hasSentOfferForItem as jest.Mock).mockReturnValue(true);
    renderTransaction();

    expect(screen.queryByText('Send offer')).toBeNull();
  });

  it('shows alert when trying to send an offer that was already sent', async () => {
    renderTransaction();

    fireEvent.changeText(screen.getByPlaceholderText('Your offer'), '150');
    await act(async () => {
      fireEvent.press(screen.getByText('Send offer'));
    });

    jest.clearAllMocks();
    (hasSentOfferForItem as jest.Mock).mockReturnValue(true);
    (getOfferForItem as jest.Mock).mockReturnValue('150');

    renderTransaction();

    expect(screen.queryByText('Send offer')).toBeNull();
  });
});
