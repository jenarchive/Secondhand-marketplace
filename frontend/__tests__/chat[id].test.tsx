import React from 'react';
import { Alert } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ChatScreen from '../app/items/chat/[id]';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMyListings } from '@/contexts/MyListingsContext';
import { addMessageForItem, getMessagesForItem } from '@/store/chatStore';
import {
  setAcceptedOfferItemPrice,
  setOfferForItem,
  getAcceptedOfferItemPrice,
  getOfferForItem,
  hasSentOfferForItem,
} from '@/store/transactionStore';

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockCanGoBack = jest.fn();
const mockAddPurchaseChatEntry = jest.fn();
const mockGetItemById = jest.fn();

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/contexts/MyListingsContext', () => ({
  useMyListings: jest.fn(),
}));

jest.mock('@/store/chatStore', () => ({
  addMessageForItem: jest.fn(),
  getMessagesForItem: jest.fn(),
}));

jest.mock('@/store/transactionStore', () => ({
  setAcceptedOfferItemPrice: jest.fn(),
  setOfferForItem: jest.fn(),
  getAcceptedOfferItemPrice: jest.fn(),
  getOfferForItem: jest.fn(),
  hasSentOfferForItem: jest.fn(),
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

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(),
  launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void) => {
    const React = require('react');
    React.useEffect(() => {
      callback();
    }, [callback]);
  },
}));

jest.mock('@/components/user-header', () => () => null);
jest.mock('@/components/themed-view', () => ({
  ThemedView: ({ children }: { children: React.ReactNode }) => {
    const { View } = require('react-native');
    return <View>{children}</View>;
  },
}));
jest.mock('@/components/themed-text', () => ({
  ThemedText: ({ children }: { children: React.ReactNode }) => {
    const { Text } = require('react-native');
    return <Text>{children}</Text>;
  },
}));

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

global.fetch = jest.fn();

const mockItem = {
  id: 1,
  title: 'My Guitar',
  description: 'Electric guitar in good condition',
  image: 'https://example.com/guitar.jpg',
  price: 200,
  category: 'Musical Instruments',
  location: 'London',
};

const renderChat = (params: Partial<Record<string, string>> = {}) => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({
    id: '1',
    sellerName: 'Seller One',
    transactionMethod: 'Delivery',
    source: 'explore',
    fromMarketplace: 'false',
    fromExplore: 'true',
    fromLikedItems: 'false',
    fromTransaction: 'false',
    fromMyChatsList: 'false',
    offerPrice: '50',
    ...params,
  });

  (useRouter as jest.Mock).mockReturnValue({
    back: mockBack,
    replace: mockReplace,
    push: mockPush,
    canGoBack: mockCanGoBack,
  });

  (useAuth as jest.Mock).mockReturnValue({
    isLoggedIn: true,
    token: 'token-abc',
  });

  (useMyListings as jest.Mock).mockReturnValue({
    items: [mockItem],
    addPurchaseChatEntry: mockAddPurchaseChatEntry,
    getItemById: mockGetItemById,
  });

  mockGetItemById.mockImplementation((id: number) => (id === 1 ? mockItem : undefined));
  (getMessagesForItem as jest.Mock).mockReturnValue([]);
  (addMessageForItem as jest.Mock).mockImplementation((itemId: number, text: string) => ({
    sentAt: 1700000000000,
    text,
    itemId,
  }));
  (getAcceptedOfferItemPrice as jest.Mock).mockReturnValue(undefined);
  (getOfferForItem as jest.Mock).mockReturnValue('');
  (hasSentOfferForItem as jest.Mock).mockReturnValue(false);
  (global.fetch as jest.Mock).mockResolvedValue({
    ok: true,
    json: async () => ({ username: 'Buyer' }),
  });

  return render(<ChatScreen />);
};

describe('RoutedChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCanGoBack.mockReturnValue(false);
  });

  it('renders the chat screen and the purchase offer controls', async () => {
    renderChat();

    expect(screen.getByText('Seller One')).toBeTruthy();
    expect(screen.getByText('My Guitar')).toBeTruthy();
    expect(screen.getByText('£200.00')).toBeTruthy();
    expect(screen.getByText('Postage £2.50')).toBeTruthy();
    expect(screen.getByText('View details')).toBeTruthy();
    expect(screen.getByText('Accept offer')).toBeTruthy();
    expect(screen.getByPlaceholderText('Enter your message.')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Buyer has made an offer.')).toBeTruthy();
    });
  });

  it('navigates to the item details screen', () => {
    renderChat();

    fireEvent.press(screen.getByText('View details'));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/items/[id]',
      params: {
        id: '1',
        fromChat: 'true',
        showBuyNowFromPurchaseChat: 'true',
      },
    });
  });

  it('sends a message and appends it to the thread', async () => {
    renderChat();

    fireEvent.changeText(screen.getByPlaceholderText('Enter your message.'), 'Hello there');
    fireEvent.press(screen.getByLabelText('Send message'));

    await waitFor(() => {
      expect(addMessageForItem).toHaveBeenCalledWith(1, 'Hello there');
      expect(screen.getByText('Hello there')).toBeTruthy();
    });
  });

  it('accepts the offer and routes to the accepted transaction screen', () => {
    renderChat();

    fireEvent.press(screen.getByText('Accept offer'));

    expect(setAcceptedOfferItemPrice).toHaveBeenCalledWith(1, 50);
    expect(setOfferForItem).toHaveBeenCalledWith(1, '50');
    expect(mockReplace).toHaveBeenCalledWith({
      pathname: '/items/transaction/offer-accepted/[id]',
      params: {
        id: '1',
        source: 'explore',
        fromMarketplace: 'false',
        fromExplore: 'true',
        fromLikedItems: 'false',
        fromMyChatsList: 'false',
      },
    });
  });

  it('goes back when the transaction flow can pop history', () => {
    mockCanGoBack.mockReturnValue(true);
    renderChat({ fromTransaction: 'true' });

    fireEvent.press(screen.getByLabelText('Back'));

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('returns to the transaction screen when it cannot pop history', () => {
    mockCanGoBack.mockReturnValue(false);
    renderChat({ fromTransaction: 'true' });

    fireEvent.press(screen.getByLabelText('Back'));

    expect(mockReplace).toHaveBeenCalledWith({
      pathname: '/items/transaction/[id]',
      params: {
        id: '1',
        source: 'explore',
        fromMarketplace: 'false',
        fromExplore: 'true',
        fromLikedItems: 'false',
      },
    });
  });

  it('opens the more menu and shows attachment options', () => {
    renderChat();

    fireEvent.press(screen.getByLabelText('More options'));

    expect(screen.getByText('Send photo')).toBeTruthy();
    expect(screen.getByText('Send video')).toBeTruthy();
  });
});
