'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { MyListingItem } from '@/store/myListingsStore';
import { getItems, setItems as setStoreItems } from '@/store/myListingsStore';

function pickRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

type MyListingsContextType = {
  items: MyListingItem[];
  myListings: MyListingItem[];
  isMyListing: (id: number) => boolean;
  updateItem: (id: number, updates: Partial<MyListingItem>) => void;
  removeItem: (id: number) => void;
  getItemById: (id: number) => MyListingItem | undefined;
  matches: Match[]; 
  recordMatch: (myId: number, targetId: number) => void;
};

type Match = { // type for storing match
  id: string; 
  myId: number;
  targetId: number;
  timestamp: Date;
};

const MyListingsContext = createContext<MyListingsContextType | null>(null);

export type { MyListingItem };

export function MyListingsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MyListingItem[]>(() => getItems());
  const [myListingIds, setMyListingIds] = useState<number[]>(() =>
    pickRandomItems(getItems(), 2).map((i) => i.id)
  );
  const [matches, setMatches] = useState<Match[]>([]);

  const myListings = useMemo(
    () => items.filter((item) => myListingIds.includes(item.id)),
    [items, myListingIds]
  );

  // func to record matches
  const recordMatch = useCallback((myId: number, targetId: number) => {
    const newMatch: Match = {
      id: `${myId}-${targetId}-${Date.now()}`, 
      myId,
      targetId,
      timestamp: new Date(),
    };

    setMatches((prev) => {
      const exists = prev.find(m => m.myId === myId && m.targetId === targetId);
      return exists ? prev : [...prev, newMatch];
    });

    console.log("Match Recorded Globally:", newMatch);
  }, []);

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
    () => ({ items, matches, recordMatch, myListings, isMyListing, updateItem, removeItem, getItemById }),
    [items, matches, recordMatch, myListings, isMyListing, updateItem, removeItem, getItemById]
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
