import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import TabTwoScreen from '../app/(tabs)/explore'; 
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

const isMyListingStub = (id: number) => id === 1;

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  Link: ({ children }: any) => children,
}));

jest.mock('@react-navigation/native', () => {
  const React = require('react');
  return {
    ...jest.requireActual('@react-navigation/native'),
    useFocusEffect: (cb: () => void) => React.useEffect(cb, []),
  };
});

jest.mock('@/components/parallax-scroll-view-horizontal', () => {
  const { View, Button } = require('react-native');
  return (props: any) => (
    <View testID="mock-parallax">
      {props.children}
      <Button title="TriggerDismiss" onPress={() => props.onCardDismiss('left')} />
      <Button title="TriggerSwipeRight" onPress={() => props.onSwipeDirection('right')} />
      <Button title="TriggerSwipeUp" onPress={() => props.onSwipeDown()} />
    </View>
  );
});

jest.mock('@/components/butterfly', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  
  return {
    __esModule: true,
    Butterfly: (props: any) => (
      <View testID="butterfly-instance">
        <TouchableOpacity onPress={props.onFinish}>
          <Text>Finish Butterfly</Text>
        </TouchableOpacity>
      </View>
    ),
  };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: (props: any) => {
    const { View } = require('react-native');
    return <View testID={props.name} {...props} />;
  },
}));

const renderExplore = (items = TEST_DATA) => {
  const mockToggleLike = jest.fn();
  const mockRecordMatch = jest.fn();
  const mockIsLiked = jest.fn().mockReturnValue(false);

  const myListingsValue = {
    items: items,
    isMyListing: isMyListingStub,
    recordMatch: mockRecordMatch,
    myListings: [items[0]], // Used Bicycle is my listing
    notifications: []
  };

  const likedItemsValue = {
    toggleLike: mockToggleLike,
    isLiked: mockIsLiked
  };

  const utils = render(
    <MyListingsContext.Provider value={myListingsValue as any}>
      <LikedItemsContext.Provider value={likedItemsValue as any}>
        <TabTwoScreen />
      </LikedItemsContext.Provider>
    </MyListingsContext.Provider>
  );

  return { ...utils, mockToggleLike, mockRecordMatch };
};

describe('Explore Page (TabTwoScreen)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the top card from explore items (excluding my listings)', () => {
    renderExplore();
    expect(screen.getByText('Acoustic Guitar')).toBeTruthy();
    expect(screen.queryByText('Used Bicycle')).toBeNull();
  });

  it('shows the next item in the stack when the top item is dismissed', async () => {
    renderExplore();
    expect(screen.getByText('Acoustic Guitar')).toBeTruthy();
    
    const dismissBtn = screen.getByText('TriggerDismiss');
    fireEvent.press(dismissBtn);
    
    expect(screen.queryByText('Acoustic Guitar')).toBeNull();
    expect(screen.getByText('Kitchen Appliances Set')).toBeTruthy();
  }); 

  it('spawns butterflies and likes item when swiping right', async () => {
  const { mockToggleLike } = renderExplore();
  
  const swipeRight = screen.getByText('TriggerSwipeRight');
  
  await act(async () => {
    fireEvent.press(swipeRight);
  });

  expect(mockToggleLike).toHaveBeenCalledWith(9);
  
  const butterflies = screen.getAllByTestId('butterfly-instance');
  expect(butterflies.length).toBeGreaterThan(0);
});

  it('removes an item from the stack on dismiss', async () => {
  renderExplore();
  const dismissBtn = screen.getByText('TriggerDismiss');

  fireEvent.press(dismissBtn);

  expect(screen.queryByText('Acoustic Guitar')).toBeNull();

  expect(screen.getByText('Kitchen Appliances Set')).toBeTruthy();
});

  it('navigates to details page when "Buy" button is pressed', () => {
    renderExplore();
    
    const buyButton = screen.getByTestId('bag').parent; 

    fireEvent.press(buyButton!, { stopPropagation: jest.fn() });

    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/items/[id]',
      params: expect.objectContaining({ 
        id: "9",
        source: 'explore',
        fromExplore: 'true'
      })
    }));
  });

  it('navigates to match-preview when confirming a match', async () => {
    renderExplore();

    const pickerToggle = screen.getByTestId('swap-horizontal').parent;
    fireEvent.press(pickerToggle!, { stopPropagation: jest.fn() });

    const myItemInPicker = screen.getByText('Used Bicycle');
    fireEvent.press(myItemInPicker);

    const confirmBtn = screen.getByText('Confirm');
    fireEvent.press(confirmBtn);

    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/items/match-preview',
      params: expect.objectContaining({
        targetId: "9", 
        myId: "1",     
      })
    }));
  });

  it('shows empty state when all cards are dismissed and allows reset', async () => {
  const SMALL_DATA = [
    { id: 1, title: "My Listing", price: 100, category: "Test", image: 'uri1', description: 'Hi' },
    { id: 2, title: "Explore Item", price: 200, category: "Test", image: 'uri2', description: 'Hi2' },
  ];

  renderExplore(SMALL_DATA);

  expect(screen.getByText('Explore Item')).toBeTruthy();

  const dismissBtn = screen.getByText('TriggerDismiss');
  fireEvent.press(dismissBtn);

  expect(screen.getByText(/Check items that you liked/i)).toBeTruthy();
  
  const resetBtn = screen.getByText(/Reset items/i); 
  fireEvent.press(resetBtn);

  expect(screen.getByText('Explore Item')).toBeTruthy();
});

it('shows empty state immediately if no items match explore criteria', () => {
  const ONLY_MINE = [
    { id: 1, title: "My Listing", price: 100, category: "Test", image: 'uri1', description: 'Hi' }
  ];

  renderExplore(ONLY_MINE);

  expect(screen.getByText(/No items to explore/i)).toBeTruthy();
});
});