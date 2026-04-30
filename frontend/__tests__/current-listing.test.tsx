import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import CurrentListingScreen from '../app/items/current-listing';
import { useMyListings } from '@/contexts/MyListingsContext';
import * as Haptics from 'expo-haptics';

const mockBack = jest.fn();
const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    back: mockBack,
    push: mockPush,
    replace: mockReplace,
  }),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock('@/contexts/MyListingsContext', () => ({
  useMyListings: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockListings = [
  {
    id: 1,
    title: 'Electric Guitar',
    description: 'Fender Stratocaster',
    price: 400,
    image: 'https://example.com/guitar.jpg',
    category: 'Musical Instruments',
    location: 'London',
  },
  {
    id: 2,
    title: 'Leather Sofa',
    description: 'Brown leather, good condition',
    price: 500,
    image: 'https://example.com/sofa.jpg',
    category: 'Furniture',
    location: 'Manchester',
  },
];

describe('CurrentListingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "No Listings Yet" when myListings is empty', () => {
    (useMyListings as jest.Mock).mockReturnValue({
      myListings: [],
    });

    render(<CurrentListingScreen />);

    expect(screen.getByText('No Listings Yet')).toBeTruthy();
    expect(screen.getByText('Go to Sell page')).toBeTruthy();
  });

  it('navigates to sell page from empty state', async () => {
    (useMyListings as jest.Mock).mockReturnValue({
      myListings: [],
    });

    render(<CurrentListingScreen />);

    await act(async () => {
      fireEvent.press(screen.getByText('Go to Sell page'));
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    expect(mockReplace).toHaveBeenCalledWith('/(tabs)/sell');
  });

  it('renders list of listings', () => {
    (useMyListings as jest.Mock).mockReturnValue({
      myListings: mockListings,
    });

    render(<CurrentListingScreen />);

    expect(screen.getByText('My Listings')).toBeTruthy();
    expect(screen.getByText('Electric Guitar')).toBeTruthy();
    expect(screen.getByText('Leather Sofa')).toBeTruthy();
  });

  it('navigates to edit item when listing is pressed', async () => {
    (useMyListings as jest.Mock).mockReturnValue({
      myListings: mockListings,
    });

    render(<CurrentListingScreen />);

    await act(async () => {
      fireEvent.press(screen.getByText('Electric Guitar'));
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    expect(mockPush).toHaveBeenCalledWith('/items/edit/1');
  });

  it('displays correct number of listings', () => {
    (useMyListings as jest.Mock).mockReturnValue({
      myListings: mockListings,
    });

    render(<CurrentListingScreen />);

    expect(screen.getByText('Electric Guitar')).toBeTruthy();
    expect(screen.getByText('Leather Sofa')).toBeTruthy();
  });

  it('renders prices correctly formatted', () => {
    (useMyListings as jest.Mock).mockReturnValue({
      myListings: mockListings,
    });

    render(<CurrentListingScreen />);

    expect(screen.getByText('£400.00')).toBeTruthy();
    expect(screen.getByText('£500.00')).toBeTruthy();
  });
});
