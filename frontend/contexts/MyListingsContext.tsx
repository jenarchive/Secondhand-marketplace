'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { MyListingItem } from '@/store/myListingsStore';
import { getItems, setItems as setStoreItems } from '@/store/myListingsStore';

type MyListingsContextType = {
  items: MyListingItem[];
  updateItem: (id: number, updates: Partial<MyListingItem>) => void;
  getItemById: (id: number) => MyListingItem | undefined;
};

const MyListingsContext = createContext<MyListingsContextType | null>(null);

export type { MyListingItem };

export function MyListingsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MyListingItem[]>(() => getItems());

  const updateItem = useCallback((id: number, updates: Partial<MyListingItem>) => {
    const next = getItems().map((item) =>
      item.id === id ? { ...item, ...updates } : { ...item }
    );
    setStoreItems(next);
    setItems(next);
  }, []);

  const getItemById = useCallback(
    (id: number) => items.find((item) => item.id === id),
    [items]
  );

  const value = useMemo(
    () => ({ items, updateItem, getItemById }),
    [items, updateItem, getItemById]
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
