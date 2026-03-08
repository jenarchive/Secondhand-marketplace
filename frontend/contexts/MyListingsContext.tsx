'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { MyListingItem } from '@/store/myListingsStore';
import { getItems, setItems as setStoreItems } from '@/store/myListingsStore';

function pickRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

type MyListingsContextType = {
  /** All items (marketplace + explore). */
  items: MyListingItem[];
  /** Only the items I have listed (for My Listings page). Starts at 4, then 3,2,1,0 on delete. */
  myListings: MyListingItem[];
  /** True if the item is one I posted (used to block liking own item elsewhere). */
  isMyListing: (id: number) => boolean;
  updateItem: (id: number, updates: Partial<MyListingItem>) => void;
  removeItem: (id: number) => void;
  getItemById: (id: number) => MyListingItem | undefined;
};

const MyListingsContext = createContext<MyListingsContextType | null>(null);

export type { MyListingItem };

export function MyListingsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MyListingItem[]>(() => getItems());
  const [myListingIds, setMyListingIds] = useState<number[]>(() =>
    pickRandomItems(getItems(), 2).map((i) => i.id)
  );

  const myListings = useMemo(
    () => items.filter((item) => myListingIds.includes(item.id)),
    [items, myListingIds]
  );

  const updateItem = useCallback((id: number, updates: Partial<MyListingItem>) => {
    const next = getItems().map((item) =>
      item.id === id ? { ...item, ...updates } : { ...item }
    );
    setStoreItems(next);
    setItems(next);
  }, []);

  const removeItem = useCallback((id: number) => {
    setMyListingIds((prev) => prev.filter((listingId) => listingId !== id));
    const next = getItems().filter((item) => item.id !== id);
    setStoreItems(next);
    setItems(next);
  }, []);

  const getItemById = useCallback(
    (id: number) => items.find((item) => item.id === id),
    [items]
  );

  const isMyListing = useCallback(
    (id: number) => myListingIds.includes(id),
    [myListingIds]
  );

  const value = useMemo(
    () => ({ items, myListings, isMyListing, updateItem, removeItem, getItemById }),
    [items, myListings, isMyListing, updateItem, removeItem, getItemById]
  );

  return (
    <MyListingsContext.Provider value={value}>
      {children}
    </MyListingsContext.Provider>
  );
}

export function useMyListings() {
  const ctx = useContext(MyListingsContext);
  if (!ctx) {
    throw new Error('useMyListings must be used within MyListingsProvider');
  }
  return ctx;
}
