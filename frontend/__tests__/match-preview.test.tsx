import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import MatchPreviewScreen from '../app/items/match-preview';
import { useMyListings } from '@/contexts/MyListingsContext';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockPush = jest.fn();
const mockAddNotification = jest.fn();
const mockGetItemById = jest.fn();

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({
    myId: '1',
    targetId: '2',
    source: 'explore',
    fromMarketplace: 'false',
    fromExplore: 'true',
    fromLikedItems: 'false',
  }),
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
    push: mockPush,
  }),
}));

jest.mock('@/contexts/MyListingsContext', () => ({
  useMyListings: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

const mockMyItem = {
  id: 1,
  title: 'My Guitar',
  description: 'Electric guitar in good condition',
  image: 'https://example.com/guitar.jpg',
  price: 200,
  category: 'Musical Instruments',
  location: 'London',
};

const mockTargetItem = {
  id: 2,
  title: 'Vintage Camera',
  description: 'Classic film camera',
  image: 'https://example.com/camera.jpg',
  price: 150,
  category: 'Electronics',
  location: 'Manchester',
};

describe('MatchPreviewScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItemById.mockImplementation((id) => {
      if (id === 1) return mockMyItem;
      if (id === 2) return mockTargetItem;
      return undefined;
    });
    (useMyListings as jest.Mock).mockReturnValue({
      getItemById: mockGetItemById,
      addNotification: mockAddNotification,
    });
  });

  it('renders both items', () => {
    render(<MatchPreviewScreen />);

    expect(screen.getByText('Trade Match')).toBeTruthy();
    expect(screen.getByText('My Listing')).toBeTruthy();
    expect(screen.getByText('Item to Match')).toBeTruthy();
    expect(screen.getByText('My Guitar')).toBeTruthy();
    expect(screen.getByText('Vintage Camera')).toBeTruthy();
  });

  it('shows error state when items are not found', () => {
    mockGetItemById.mockReturnValue(undefined);

    render(<MatchPreviewScreen />);

    expect(screen.getByText('Match items not found.')).toBeTruthy();
  });

  it('shows error when only my item is missing', () => {
    mockGetItemById.mockImplementation((id) => {
      if (id === 2) return mockTargetItem;
      return undefined;
    });

    render(<MatchPreviewScreen />);

    expect(screen.getByText('Match items not found.')).toBeTruthy();
  });

  it('shows error when only target item is missing', () => {
    mockGetItemById.mockImplementation((id) => {
      if (id === 1) return mockMyItem;
      return undefined;
    });

    render(<MatchPreviewScreen />);

    expect(screen.getByText('Match items not found.')).toBeTruthy();
  });

  it('sends match offer and navigates to chat', async () => {
    render(<MatchPreviewScreen />);

    const sendButton = screen.getByText('Send match offer');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(mockAddNotification).toHaveBeenCalledWith(1, 2);
      expect(mockReplace).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/items/chat',
          params: expect.objectContaining({
            myId: '1',
            targetId: '2',
            source: 'explore',
            fromMarketplace: 'false',
            fromExplore: 'true',
            fromLikedItems: 'false',
          }),
        })
      );
    });
  });

  it('navigates to my item details when my item is pressed', () => {
    render(<MatchPreviewScreen />);

    fireEvent.press(screen.getByText('My Guitar'));

    expect(mockPush).toHaveBeenCalledWith('/items/1');
  });

  it('navigates to target item details when target item is pressed', () => {
    render(<MatchPreviewScreen />);

    fireEvent.press(screen.getByText('Vintage Camera'));

    expect(mockPush).toHaveBeenCalledWith('/items/2');
  });

  it('navigates back when back button is pressed', () => {
    render(<MatchPreviewScreen />);

    fireEvent.press(screen.getByTestId('back-button'));

    expect(mockBack).toHaveBeenCalled();
  });
});

