import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import HomeScreen from '../app/items/[id]'; 
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useLikedItems } from '@/contexts/LikedItemsContext';
import { useMyListings } from '@/contexts/MyListingsContext';
import {
  isItemSoldOnMarketplace,
  isPendingMeetupReservation,
} from '@/store/pendingMeetupStore';

// --- MOCKS ---
jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

jest.mock('@/contexts/LikedItemsContext', () => ({
  useLikedItems: jest.fn(),
}));

jest.mock('@/contexts/MyListingsContext', () => ({
  useMyListings: jest.fn(),
}));

jest.mock('@/store/pendingMeetupStore', () => ({
  subscribePendingMeetup: jest.fn(),
  getPendingMeetupVersion: jest.fn(() => 1),
  isPendingMeetupReservation: jest.fn(() => false),
  isItemSoldOnMarketplace: jest.fn(() => false),
}));

jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useFocusEffect: (callback: () => void) => {
      require('react').useEffect(() => {
        callback();
      }, [callback]);
    },
  };
});

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => <View testID={props.testID || 'mock-ionicons'} />,
    FontAwesome6: (props: any) => <View testID={props.testID || 'mock-fa6'} />,
  };
});

jest.mock('@expo/vector-icons/Ionicons', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: any) => <View testID={props.testID || 'mock-ionicons'} />,
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
}));

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: ({ alt, testID, source }: any) => (
      <View 
        testID={testID || "item-image"} 
        accessibilityLabel={alt}
        nativeID={source?.uri} 
      />
    ),
  };
});

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: () => ({ width: 400, height: 800 }),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 20, top: 0, left: 0, right: 0 }),
}));

jest.spyOn(Alert, 'alert');

describe('Item HomeScreen', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  };

  const mockItem = {
    id: 1,
    title: 'Vintage Leather Jacket',
    description: 'Great condition',
    price: 150,
    category: 'Clothing',
    image: 'uri1',
    location: 'London',
  };

  const mockMyItem = {
    id: 99,
    title: 'My Old Guitar',
    description: 'Needs new strings',
    price: 100,
    category: 'Music',
    image: 'uri2',
    location: 'London',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '1' });
    
    // Default Context Returns
    (useLikedItems as jest.Mock).mockReturnValue({
      toggleLike: jest.fn(),
      isLiked: jest.fn(() => false),
    });

    (useMyListings as jest.Mock).mockReturnValue({
      items: [mockItem, mockMyItem],
      isMyListing: jest.fn((id) => id === 99), 
      removeItem: jest.fn(),
      notifications: [],
    });

    (isItemSoldOnMarketplace as jest.Mock).mockReturnValue(false);
    (isPendingMeetupReservation as jest.Mock).mockReturnValue(false);
  });

  describe('Rendering', () => {
    it('renders "Item not found" if the ID does not exist', () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '999' });
      render(<HomeScreen />);
      expect(screen.getByText('Item not found')).toBeTruthy();
    });

    it('renders item details correctly for an item that is not mine', () => {
      render(<HomeScreen />);
      
      expect(screen.getAllByText('Vintage Leather Jacket').length).toBeGreaterThan(0);
      expect(screen.getByText('Category: Clothing')).toBeTruthy();
      expect(screen.getByText('Great condition')).toBeTruthy();
      expect(screen.getByLabelText('Buy Now')).toBeTruthy();
      // Should NOT show Edit/Remove for someone else's item
      expect(screen.queryByLabelText('Edit')).toBeNull();
    });

		it('renders edit and remove buttons for my own items', () => {
			(useLocalSearchParams as jest.Mock).mockReturnValue({ id: '99' });
			
			render(<HomeScreen />);
			
			const titleElement = screen.getByTestId('title');
			expect(titleElement).toHaveTextContent('My Old Guitar');
			
			expect(screen.getByLabelText('Edit')).toBeTruthy();
			expect(screen.getByLabelText('Remove')).toBeTruthy();
			
			expect(screen.queryByLabelText('Buy Now')).toBeNull();
		});
	});

  describe('States (Badges & Stamps)', () => {
    it('shows SOLD stamp and disables Buy Now routing', () => {
      (isItemSoldOnMarketplace as jest.Mock).mockReturnValue(true);
      render(<HomeScreen />);
      
      expect(screen.getByText('SOLD')).toBeTruthy();
      
      const buyNowBtn = screen.getByLabelText('Sold'); 
      fireEvent.press(buyNowBtn);
      
      expect(Alert.alert).toHaveBeenCalledWith('Unavailable', 'Sorry, this item is no longer available');
      expect(mockRouter.push).not.toHaveBeenCalled();
    });

    it('shows RESERVED stamp and alters Buy Now behavior', () => {
      (isPendingMeetupReservation as jest.Mock).mockReturnValue(true);
      render(<HomeScreen />);
      
      expect(screen.getByText('RESERVED')).toBeTruthy();
      
      const buyNowBtn = screen.getByLabelText('Reserved');
      fireEvent.press(buyNowBtn);
      
      expect(Alert.alert).toHaveBeenCalledWith('Reserved', 'Sorry, this item is already reserved');
    });
	});

  describe('Interactions & Navigation', () => {
    it('toggles like when the heart icon is pressed', () => {
        const mockToggleLike = jest.fn();
        
        (useLikedItems as jest.Mock).mockReturnValue({
        toggleLike: mockToggleLike,
        isLiked: jest.fn(() => false),
        });

        render(<HomeScreen />);
        
        const likeButton = screen.getByTestId('likeButton');
        
        fireEvent.press(likeButton);
        
        expect(mockToggleLike).toHaveBeenCalledWith(1);
    });

    it('navigates to transaction page when Buy Now is pressed', async () => {
			(useMyListings as jest.Mock).mockReturnValue({
				items: [{ id: 1, title: 'Vintage Leather Jacket' }],
				isMyListing: jest.fn(() => false), 
				notifications: [],
			});

			render(<HomeScreen />);

			const buyNowBtn = screen.getByLabelText('Buy Now');
			fireEvent.press(buyNowBtn);

			await waitFor(() => {
				expect(mockRouter.push).toHaveBeenCalledWith(
					expect.objectContaining({
						pathname: '/items/transaction/[id]',
						params: expect.objectContaining({ 
							id: "1" 
						}),
					})
				);
			});
		});

    it('shows confirmation alert when Remove is pressed and handles deletion', async () => {
      const mockRemoveItem = jest.fn();
      (useLocalSearchParams as jest.Mock).mockReturnValue({ id: '99' });
      (useMyListings as jest.Mock).mockReturnValue({
        items: [mockItem, mockMyItem],
        isMyListing: jest.fn((id) => id === 99),
        removeItem: mockRemoveItem,
        notifications: [],
      });

      render(<HomeScreen />);
      
      fireEvent.press(screen.getByLabelText('Remove'));
      
      expect(Alert.alert).toHaveBeenCalledWith(
        'Remove listing',
        'Are you sure you want to remove this listing? This action cannot be undone.',
        [{ "style": "cancel", "text": "Cancel" }, { "onPress": expect.any(Function), "style": "destructive", "text": "Remove" }]
      );

      const alertButtons = (Alert.alert as jest.Mock).mock.calls[0][2];
      const removeButton = alertButtons.find((b: any) => b.style === 'destructive');
      
      removeButton.onPress();

      expect(mockRemoveItem).toHaveBeenCalledWith(99);
      expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
    });

    it('opens match picker and allows selecting an item to match', () => {
			const mockMyListing = { id: 99, title: 'My Old Guitar', image: 'uri2' };
			(useMyListings as jest.Mock).mockReturnValue({
					items: [
							{ id: 1, title: 'Vintage Jacket', location: 'London' }, 
							mockMyListing 
					],
					isMyListing: jest.fn((id) => id === 99),
					notifications: [],
			});

			render(<HomeScreen />);

			const matchBadge = screen.getByTestId('matchBadge');
			fireEvent.press(matchBadge);

			expect(screen.getByText(/Match with my listing/i)).toBeTruthy();
			expect(screen.getByText('My Old Guitar')).toBeTruthy();

			const myItemToMatch = screen.getByText('My Old Guitar');
			
			fireEvent.press(myItemToMatch, {
					stopPropagation: jest.fn(),
			});

			const confirmButton = screen.getByText('Confirm');
			expect(confirmButton).toBeTruthy();

			fireEvent.press(confirmButton, {
					stopPropagation: jest.fn(),
			});
			
			expect(mockRouter.push).toHaveBeenCalledWith(
					expect.objectContaining({
							pathname: '/items/match-preview',
							params: expect.objectContaining({
									targetId: '1',
									myId: '99',
							}),
					})
			);
		});
	});
});