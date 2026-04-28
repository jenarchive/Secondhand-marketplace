import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/index';
import { LikedItemsContext } from '@/contexts/LikedItemsContext';
import { MyListingsContext } from '@/contexts/MyListingsContext';

// 1. DATASET FROM YOUR JSON
const TEST_DATA = [
  { id: 1, title: "Used Bicycle", price: 150, category: "Sports & Outdoors", description: "well-maintained" },
  { id: 2, title: "Vintage Camera", price: 300.5, category: "Electronics", description: "classic" },
  { id: 3, title: "Leather Sofa", price: 500, category: "Furniture", description: "comfortable" },
  { id: 4, title: "Electric Guitar", price: 400, category: "Musical Instruments", description: "high-quality" },
  { id: 5, title: "Kitchen Appliances Set", price: 250.99, category: "Home & Kitchen", description: "essential" },
  { id: 9, title: "Acoustic Guitar", price: 200, category: "Musical Instruments", description: "rich sound" },
];

// 2. MOCKS
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock('@expo/vector-icons', () => {
  const { View } = require('react-native');
  return {
    Ionicons: (props: any) => {
      // This creates a dummy view that looks like the icon to the test engine
      // We use the 'name' as the testID so your tests can find it
      return <View testID={props.name} {...props} />;
    },
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium', Heavy: 'heavy', Light: 'light' },
}));

// Mock for ParallaxScrollView and safe area
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

//   ## Search Logic
  it('filters items by title or description', async () => {
    renderHomeScreen();
    const searchInput = screen.getByPlaceholderText(/Search items/i);

    // Search for "Leather"
    fireEvent.changeText(searchInput, 'Leather');
    expect(screen.getByText('Leather Sofa')).toBeTruthy();
    expect(screen.queryByText('Used Bicycle')).toBeNull();

    // Search for description keyword "rich"
    fireEvent.changeText(searchInput, 'rich');
    expect(screen.getByText('Acoustic Guitar')).toBeTruthy();
  });

//   ## Custom Category Logic
//   it('correctly maps "Furniture" category when "Home" is selected', async () => {
//     renderHomeScreen();
    
//     // Open Category Modal
//     const categoryBtn = screen.getByTestId('pricetag-outline').parent;
//     fireEvent.press(categoryBtn);

//     // Select "Home" (This triggers your logic: sel === 'home' && cat.includes('furniture'))
//     const homeOption = await screen.findByText('Home');
//     fireEvent.press(homeOption);

//     // Leather Sofa is "Furniture", so it should show up under "Home"
//     expect(screen.getByText('Leather Sofa')).toBeTruthy();
//     expect(screen.queryByText('Vintage Camera')).toBeNull();
//   });

  it('correctly maps "Musical Instruments" when "Entertainment" is selected', async () => {
    renderHomeScreen();
    
    fireEvent.press(screen.getByTestId('pricetag-outline').parent!);
    
    // Select "Entertainment"
    const entertainmentOption = await screen.findByText('Entertainment');
    fireEvent.press(entertainmentOption);

    // Both guitars are "Musical Instruments", should show up under "Entertainment"
    expect(screen.getByText('Electric Guitar')).toBeTruthy();
    expect(screen.getByText('Acoustic Guitar')).toBeTruthy();
  });

//   ## Navigation & Routing
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

//   ## Context Interaction (Liking)
  it('triggers toggleLike context function on heart press', async () => {
  const { mockToggleLike } = renderHomeScreen();

  // Find the heart icon
  const heartButtons = screen.getAllByTestId('heart-outline'); 
  
  // PASS A MOCK EVENT OBJECT
  fireEvent.press(heartButtons[0], {
    stopPropagation: jest.fn(),
  });

  expect(mockToggleLike).toHaveBeenCalledWith(1);
});
});