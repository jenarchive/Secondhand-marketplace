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

const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
  Link: ({ children }: any) => children,
}));

// Mocking custom components to simplify testing logic
jest.mock('@/components/parallax-scroll-view-horizontal', () => {
  const { View, Button } = require('react-native');
  return (props: any) => (
    <View testID="mock-parallax">
      {props.children}
      {/* Expose internal triggers for testing */}
      <Button title="TriggerDismiss" onPress={() => props.onCardDismiss('left')} />
      <Button title="TriggerSwipeRight" onPress={() => props.onSwipeDirection('right')} />
      <Button title="TriggerSwipeUp" onPress={() => props.onSwipeDown()} />
    </View>
  );
});

jest.mock('@/components/butterfly', () => {
  const { View, Button } = require('react-native');
  return (props: any) => (
    <View testID="butterfly-instance">
      <Button title="Finish" onPress={props.onFinish} />
    </View>
  );
});

const TEST_ITEMS = [
  { id: 1, title: 'Item One', price: 100, image: 'uri1' },
  { id: 2, title: 'Item Two', price: 200, image: 'uri2' },
  { id: 99, title: 'My Item', price: 50, image: 'uriMy' },
];

const renderExplore = (items = TEST_ITEMS) => {
  const mockToggleLike = jest.fn();
  const mockRecordMatch = jest.fn();
  const mockIsLiked = jest.fn().mockReturnValue(false);

  const view = render(
    <MyListingsContext.Provider
      value={{
        items,
        isMyListing: (id: number) => id === 99,
        recordMatch: mockRecordMatch,
        myListings: [{ id: 99, title: 'My Item' }],
      } as any}
    >
      <LikedItemsContext.Provider value={{ toggleLike: mockToggleLike, isLiked: mockIsLiked } as any}>
        <TabTwoScreen />
      </LikedItemsContext.Provider>
    </MyListingsContext.Provider>
  );

  return { ...view, mockToggleLike, mockRecordMatch, mockIsLiked };
};

describe('Explore Page (TabTwoScreen)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the top card from the explore items', () => {
    renderExplore();
    expect(screen.getByText('Item Two')).toBeTruthy();
  });

  it('removes an item from the stack on dismiss', async () => {
    renderExplore();
    const dismissBtn = screen.getByText('TriggerDismiss');

    fireEvent.press(dismissBtn);
    
    expect(screen.queryByText('Item Two')).toBeNull();
    expect(screen.getByText('Item One')).toBeTruthy();
  });

  it('navigates to details page when "Buy" button is pressed', () => {
    renderExplore();
    const buyButton = screen.getByTestId('bag').parent; 

    fireEvent.press(buyButton!);

    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/items/[id]',
      params: expect.objectContaining({ id: "2" })
    }));
  });

  it('toggles like and spawns butterflies when swiping right', async () => {
    const { mockToggleLike } = renderExplore();
    const swipeRightTrigger = screen.getByText('TriggerSwipeRight');

    fireEvent.press(swipeRightTrigger);

    expect(mockToggleLike).toHaveBeenCalledWith(2);
    
    const butterflies = screen.getAllByTestId('butterfly-instance');
    expect(butterflies.length).toBeGreaterThan(0);

    fireEvent.press(screen.getAllByText('Finish')[0]);
    expect(screen.queryAllByTestId('butterfly-instance').length).toBe(butterflies.length - 1);
  });

  it('shows the match picker and allows matching with my listing', async () => {
    const { mockRecordMatch } = renderExplore();

    const pickerToggle = screen.getByTestId('swap-horizontal').parent;
    fireEvent.press(pickerToggle!);

    expect(screen.getByText('Match with my listing')).toBeTruthy();
    
    const myItemOption = screen.getByText('My Item');
    fireEvent.press(myItemOption);

    const confirmBtn = screen.getByText('Confirm');
    fireEvent.press(confirmBtn);

    expect(mockPush).toHaveBeenCalledWith(expect.objectContaining({
      pathname: '/items/match-preview',
      params: expect.objectContaining({
        targetId: "2",
        myId: "99"
      })
    }));
  });

  // ## Empty State & Reset
  // it('shows empty state when no cards left and allows reset', async () => {
  //   renderExplore([ { id: 99, title: 'Mine' } ]); // Only my item, so explore is empty initially
    
  //   expect(screen.getByText('No items to explore')).toBeTruthy();

  //   // Or simulate clearing items
  //   const { rerender } = renderExplore();
  //   // Simulate dismissing all cards logic...
  //   // (In a real test, you'd trigger dismiss twice)
    
  //   expect(screen.getByText('Check items that you liked')).toBeTruthy();
  // });
});