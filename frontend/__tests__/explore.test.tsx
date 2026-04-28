import React from 'react';
import { render, screen } from '@testing-library/react-native';
import Explore from '../app/(tabs)/explore';
import { LikedItemsContext } from '@/contexts/LikedItemsContext';
import { MyListingsContext } from '@/contexts/MyListingsContext';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn(),
}));

jest.mock('expo-router', () => {
  return {
    useRouter: () => ({ push: jest.fn() }),
    Link: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: ({ alt }: { alt?: string }) => <View accessibilityLabel={alt} />,
  };
});

jest.mock('@expo/vector-icons', () => {
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name }: { name: string }) => <Text testID={name}>{name}</Text>,
  };
});

jest.mock('@/components/parallax-scroll-view-horizontal', () => {
  const { View } = require('react-native');
  return ({ children }: { children: React.ReactNode }) => (
    <View testID="parallax-scroll">{children}</View>
  );
});

const TEST_ITEMS = [
  {
    id: 1,
    title: 'Used Bicycle',
    description: 'A well-maintained used bicycle in good condition.',
    price: 150,
    image: 'https://example.com/bicycle.jpg',
    category: 'Sports & Outdoors',
    location: 'New York, NY',
  },
  {
    id: 2,
    title: 'Vintage Camera',
    description: 'A classic vintage camera for photography enthusiasts.',
    price: 300.5,
    image: 'https://example.com/camera.jpg',
    category: 'Electronics',
    location: 'Los Angeles, CA',
  },
  {
    id: 3,
    title: 'Leather Sofa',
    description: 'Comfortable leather sofa, perfect for living rooms.',
    price: 500,
    image: 'https://example.com/sofa.jpg',
    category: 'Furniture',
    location: 'Chicago, IL',
  },
];

const renderExplore = (myListingIds = [1, 2]) => {
  const items = TEST_ITEMS;
  const myListings = items.filter((item) => myListingIds.includes(item.id));

  return render(
    <MyListingsContext.Provider
      value={{
        items,
        myListings,
        isMyListing: (id: number) => myListingIds.includes(id),
        recordMatch: jest.fn(),
        updateItem: jest.fn(),
        removeItem: jest.fn(),
        getItemById: jest.fn(),
        matches: [],
        notifications: [],
        addNotification: jest.fn(),
        addPurchaseChatEntry: jest.fn(),
        removeNotification: jest.fn(),
      } as any}
    >
      <LikedItemsContext.Provider
        value={{
          likedMap: {},
          likedOrder: [],
          toggleLike: jest.fn(),
          clearAllLikes: jest.fn(),
          setLikedOrder: jest.fn(),
          isLiked: () => false,
        } as any}
      >
        <Explore />
      </LikedItemsContext.Provider>
    </MyListingsContext.Provider>
  );
};

describe('Explore Screen Integration Tests', () => {
  describe('Rendering', () => {
    it('should render the screen', () => {
      renderExplore();
      const element = screen.getByTestId('parallax-scroll');
      expect(element).toBeTruthy();
    });

    it('shows empty state when no items are available', () => {
      renderExplore([1, 2, 3]);
      const emptyState = screen.getByText(/No items to explore/i);
      expect(emptyState).toBeTruthy();
    });

    it('renders top card correctly', () => {
      renderExplore([1, 2]);
      expect(screen.getByText('Leather Sofa')).toBeTruthy();
      expect(screen.getByText('£500.00')).toBeTruthy();
    });
  });
});