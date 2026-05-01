import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import YourChatsScreen from '../app/items/your-chats';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMyListings } from '@/contexts/MyListingsContext';
import { isItemSoldOnMarketplace, isPendingMeetupReservation } from '@/store/pendingMeetupStore';
import type { ChatListNotificationType } from '@/contexts/MyListingsContext';

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockGetItemById = jest.fn();

type ChatNotification = {
  id: string;
  myId: number;
  targetId: number;
  type: ChatListNotificationType;
  timestamp: Date;
  createdAt: Date;
};

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock('@/contexts/MyListingsContext', () => ({
  useMyListings: jest.fn(),
}));

jest.mock('@/store/pendingMeetupStore', () => ({
  subscribePendingMeetup: jest.fn(() => () => undefined),
  getPendingMeetupVersion: jest.fn(() => 1),
  isPendingMeetupReservation: jest.fn(),
  isItemSoldOnMarketplace: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('expo-image', () => ({
  Image: () => null,
}));

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

const items = [
  { id: 1, title: 'Old Guitar', image: 'https://example.com/guitar.jpg' },
  { id: 2, title: 'Vintage Camera', image: 'https://example.com/camera.jpg' },
  { id: 3, title: 'Leather Sofa', image: 'https://example.com/sofa.jpg' },
  { id: 4, title: 'Desk Lamp', image: 'https://example.com/lamp.jpg' },
];

const makeDate = (iso: string) => new Date(iso);

const matchNotification: ChatNotification = {
  id: 'match-1',
  myId: 1,
  targetId: 2,
  type: 'MATCH_OFFER' as const,
  timestamp: makeDate('2024-01-01T10:00:00.000Z'),
  createdAt: makeDate('2024-01-01T10:00:00.000Z'),
};

const purchaseNotification: ChatNotification = {
  id: 'purchase-1',
  myId: 0,
  targetId: 3,
  type: 'PURCHASE' as const,
  timestamp: makeDate('2024-01-03T10:00:00.000Z'),
  createdAt: makeDate('2024-01-03T10:00:00.000Z'),
};

const reservedNotification: ChatNotification = {
  id: 'purchase-2',
  myId: 0,
  targetId: 4,
  type: 'PURCHASE' as const,
  timestamp: makeDate('2024-01-02T10:00:00.000Z'),
  createdAt: makeDate('2024-01-02T10:00:00.000Z'),
};

const renderScreen = (notifications: ChatNotification[] = [matchNotification]) => {
  (useLocalSearchParams as jest.Mock).mockReturnValue({ backToProfile: 'false' });
  (useRouter as jest.Mock).mockReturnValue({
    back: mockBack,
    replace: mockReplace,
    push: mockPush,
  });
  (useMyListings as jest.Mock).mockReturnValue({
    notifications,
    getItemById: mockGetItemById,
  });
  mockGetItemById.mockImplementation((id: number) => items.find((item) => item.id === id));
  (isItemSoldOnMarketplace as jest.Mock).mockImplementation((id: number) => id === 3);
  (isPendingMeetupReservation as jest.Mock).mockImplementation((id: number) => id === 4);

  return render(<YourChatsScreen />);
};

describe('YourChatsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows the empty state when there are no chats', () => {
    renderScreen([]);

    expect(screen.getByText('My Chats')).toBeTruthy();
    expect(screen.getByText('No chats yet')).toBeTruthy();
  });

  it('goes back when the back button is pressed', () => {
    renderScreen([]);

    fireEvent.press(screen.getByLabelText('Back'));

    expect(mockBack).toHaveBeenCalledTimes(1);
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('returns to profile when backToProfile is true', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({ backToProfile: 'true' });
    (useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
      replace: mockReplace,
      push: mockPush,
    });
    (useMyListings as jest.Mock).mockReturnValue({
      notifications: [],
      getItemById: mockGetItemById,
    });

    render(<YourChatsScreen />);

    fireEvent.press(screen.getByLabelText('Back'));

    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/profile');
    expect(mockBack).not.toHaveBeenCalled();
  });

  it('renders notification cards sorted by newest first and with correct labels', () => {
    renderScreen([matchNotification, purchaseNotification, reservedNotification]);

    const labels = screen.getAllByText(/Match in progress|Purchase in progress|Bought|Reserved/).map((node) => node.props.children);
    expect(labels).toEqual(['Bought', 'Reserved', 'Match in progress']);
    expect(screen.getByText(/Leather Sofa/)).toBeTruthy();
    expect(screen.getByText(/Vintage Camera/)).toBeTruthy();
    expect(screen.getByText(/Desk Lamp/)).toBeTruthy();
  });

  it('navigates to the match chat when a MATCH_OFFER card is pressed', () => {
    renderScreen([matchNotification]);

    fireEvent.press(screen.getByText(/Vintage Camera/));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/items/chat',
      params: { myId: 1, targetId: 2 },
    });
  });

  it('navigates to the item chat screen for purchase notifications', () => {
    renderScreen([purchaseNotification]);

    fireEvent.press(screen.getByText(/Leather Sofa/));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/items/chat/[id]',
      params: {
        id: '3',
        sellerName: 'User3',
        fromTransaction: 'true',
        fromMyChatsList: 'true',
      },
    });
  });

  it('labels sold and reserved purchase chats correctly', () => {
    renderScreen([purchaseNotification, reservedNotification]);

    expect(screen.getByText('Bought')).toBeTruthy();
    expect(screen.getByText('Reserved')).toBeTruthy();
  });
});
