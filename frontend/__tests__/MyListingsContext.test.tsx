import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { MyListingsProvider, useMyListings } from '../contexts/MyListingsContext';

jest.mock('@/store/myListingsStore', () => ({
  getItems: jest.fn(() => [
    { id: 1, title: 'Used Bicycle', price: 150, description: 'A bike', image: '', category: 'Sports', location: 'NY' },
    { id: 2, title: 'Vintage Camera', price: 300, description: 'A camera', image: '', category: 'Electronics', location: 'LA' },
    { id: 3, title: 'Leather Sofa', price: 500, description: 'A sofa', image: '', category: 'Furniture', location: 'Chicago' },
  ]),
  setItems: jest.fn(),
  subscribe: jest.fn(),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MyListingsProvider>{children}</MyListingsProvider>
);

describe('MyListingsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides items from the store', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });
    expect(result.current.items.length).toBe(3);
  });

  it('getItemById returns the correct item', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });
    const item = result.current.getItemById(1);
    expect(item).toBeDefined();
    expect(item?.title).toBe('Used Bicycle');
  });

  it('getItemById returns undefined for an unknown id', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });
    expect(result.current.getItemById(99999)).toBeUndefined();
  });

  it('myListings contains a subset of items and isMyListing reflects it', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });
    expect(result.current.myListings.length).toBeGreaterThan(0);
    for (const item of result.current.myListings) {
      expect(result.current.isMyListing(item.id)).toBe(true);
    }
  });

  it('isMyListing returns false for items not in myListings', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });
    const myIds = new Set(result.current.myListings.map((i) => i.id));
    const notMine = result.current.items.find((i) => !myIds.has(i.id));
    if (notMine) {
      expect(result.current.isMyListing(notMine.id)).toBe(false);
    }
  });

  it('recordMatch adds a match entry', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });

    act(() => {
      result.current.recordMatch(1, 2);
    });

    expect(result.current.matches.some((m) => m.myId === 1 && m.targetId === 2)).toBe(true);
  });

  it('recordMatch does not create duplicate matches', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });

    act(() => {
      result.current.recordMatch(1, 3);
      result.current.recordMatch(1, 3);
    });

    const count = result.current.matches.filter((m) => m.myId === 1 && m.targetId === 3).length;
    expect(count).toBe(1);
  });

  it('addNotification adds a MATCH_OFFER notification', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });

    act(() => {
      result.current.addNotification(1, 2);
    });

    expect(
      result.current.notifications.some(
        (n) => n.myId === 1 && n.targetId === 2 && n.type === 'MATCH_OFFER'
      )
    ).toBe(true);
  });

  it('addNotification does not create duplicate MATCH_OFFER entries', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });

    act(() => {
      result.current.addNotification(2, 3);
      result.current.addNotification(2, 3);
    });

    const count = result.current.notifications.filter(
      (n) => n.myId === 2 && n.targetId === 3 && n.type === 'MATCH_OFFER'
    ).length;
    expect(count).toBe(1);
  });

  it('addPurchaseChatEntry adds a PURCHASE notification', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });

    act(() => {
      result.current.addPurchaseChatEntry(5);
    });

    expect(
      result.current.notifications.some((n) => n.type === 'PURCHASE' && n.targetId === 5)
    ).toBe(true);
  });

  it('addPurchaseChatEntry does not create duplicate PURCHASE entries', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });

    act(() => {
      result.current.addPurchaseChatEntry(6);
      result.current.addPurchaseChatEntry(6);
    });

    const count = result.current.notifications.filter(
      (n) => n.type === 'PURCHASE' && n.targetId === 6
    ).length;
    expect(count).toBe(1);
  });

  it('removeNotification removes the matching MATCH_OFFER entry and its match', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });

    act(() => {
      result.current.addNotification(3, 4);
      result.current.recordMatch(3, 4);
    });

    act(() => {
      result.current.removeNotification(3, 4);
    });

    expect(result.current.notifications.some((n) => n.myId === 3 && n.targetId === 4)).toBe(false);
    expect(result.current.matches.some((m) => m.myId === 3 && m.targetId === 4)).toBe(false);
  });

  it('updateItem updates the item title in state', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });

    act(() => {
      result.current.updateItem(1, { title: 'New Title' });
    });

    const updated = result.current.items.find((i) => i.id === 1);
    expect(updated?.title).toBe('New Title');
  });

  it('removeItem removes the item from state', () => {
    const { result } = renderHook(() => useMyListings(), { wrapper });

    act(() => {
      result.current.removeItem(1);
    });

    expect(result.current.items.find((i) => i.id === 1)).toBeUndefined();
  });

  it('useMyListings throws when used outside MyListingsProvider', () => {
    expect(() => {
      renderHook(() => useMyListings());
    }).toThrow('useMyListings must be used within MyListingsProvider');
  });
});
