import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/index';
import { LikedItemsContext } from '@/contexts/LikedItemsContext';
import { MyListingsContext } from '@/contexts/MyListingsContext';

const TEST_DATA = [
  { id: 1, title: "Used Bicycle", price: 150, category: "Sports & Outdoors", description: "well-maintained" },
  { id: 2, title: "Vintage Camera", price: 300.5, category: "Electronics", description: "classic" },
  { id: 3, title: "Leather Sofa", price: 500, category: "Furniture", description: "comfortable" },
  { id: 4, title: "Electric Guitar", price: 400, category: "Musical Instruments", description: "high-quality" },
  { id: 5, title: "Kitchen Appliances Set", price: 250.99, category: "Home & Kitchen", description: "essential" },
  { id: 9, title: "Acoustic Guitar", price: 200, category: "Musical Instruments", description: "rich sound" },
];

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => {
      return <View testID={props.name} {...props} />;
    },
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium', Heavy: 'heavy', Light: 'light' },
}));

jest.mock('@/components/parallax-scroll-view', () => ({ children }: any) => <>{children}</>);
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 50, bottom: 0 }),
}));

const renderHomeScreen = (items = TEST_DATA) => {
  const mockToggleLike = jest.fn();
  const mockIsLiked = jest.fn().mockReturnValue(false);
  
  const view = render(
    <MyListingsContext.Provider value={{ items, isMyListing: () => false, notifications: [] } as any}>
      <LikedItemsContext.Provider value={{ toggleLike: mockToggleLike, isLiked: mockIsLiked } as any}>
        <HomeScreen />
      </LikedItemsContext.Provider>
    </MyListingsContext.Provider>
  );

  return { ...view, mockToggleLike };
};

describe('HomeScreen Integration Tests', () => {
  beforeEach(() => jest.clearAllMocks());

  it('filters items by title or description', async () => {
    renderHomeScreen();
    const searchInput = screen.getByPlaceholderText(/Search items/i);

    fireEvent.changeText(searchInput, 'Leather');
    expect(screen.getByText('Leather Sofa')).toBeTruthy();
    expect(screen.queryByText('Used Bicycle')).toBeNull();

    fireEvent.changeText(searchInput, 'rich');
    expect(screen.getByText('Acoustic Guitar')).toBeTruthy();
  });

  it('correctly maps "Musical Instruments" when "Entertainment" is selected', async () => {
    renderHomeScreen();
    
    fireEvent.press(screen.getByTestId('pricetag-outline').parent!);
    
    const entertainmentOption = await screen.findByText('Entertainment');
    fireEvent.press(entertainmentOption);

    expect(screen.getByText('Electric Guitar')).toBeTruthy();
    expect(screen.getByText('Acoustic Guitar')).toBeTruthy();
  });

  it('navigates to the correct item details with params', async () => {
    renderHomeScreen();
    
    const bikeItem = screen.getByText('Used Bicycle');
    
    await act(async () => {
      fireEvent.press(bikeItem);
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/items/[id]',
      params: {
        id: "1",
        source: 'marketplace',
        fromMarketplace: 'true',
      },
    });
  });

  it('triggers toggleLike context function on heart press', async () => {
  const { mockToggleLike } = renderHomeScreen();

  const heartButtons = screen.getAllByTestId('heart-outline'); 
  
  fireEvent.press(heartButtons[0], {
    stopPropagation: jest.fn(),
  });

  expect(mockToggleLike).toHaveBeenCalledWith(1);
});
});