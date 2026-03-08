'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import TestData from '@/test-data.json';

export type MyListingItem = (typeof TestData.items)[number];

type MyListingsContextType = {
  items: MyListingItem[];
  updateItem: (id: number, updates: Partial<MyListingItem>) => void;
  getItemById: (id: number) => MyListingItem | undefined;
};

const MyListingsContext = createContext<MyListingsContextType | null>(null);

export function MyListingsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MyListingItem[]>(() => [...TestData.items]);

  const updateItem = useCallback((id: number, updates: Partial<MyListingItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  const getItemById = useCallback(
    (id: number) => items.find((item) => item.id === id),
    [items]
  );

  return (
    <MyListingsContext.Provider value={{ items, updateItem, getItemById }}>
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
