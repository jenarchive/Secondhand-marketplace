'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { MyListingItem } from '@/store/myListingsStore';
import { getItems, setItems as setStoreItems } from '@/store/myListingsStore';

function pickRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, array.length));
}

export type ChatListNotificationType = 'MATCH_OFFER' | 'PURCHASE';

type MyListingsContextType = {
  items: MyListingItem[];
  myListings: MyListingItem[];
  isMyListing: (id: number) => boolean;
  updateItem: (id: number, updates: Partial<MyListingItem>) => void;
  removeItem: (id: number) => void;
  getItemById: (id: number) => MyListingItem | undefined;
  matches: Match[]; 
  recordMatch: (myId: number, targetId: number) => void;
  notifications: Notification[];
  addNotification: (myId: number, targetId: number) => void;
  addPurchaseChatEntry: (itemId: number) => void;
  removeNotification: (myId: number, targetId: number) => void;
};

type Match = { // type for storing match
  id: string; 
  myId: number;
  targetId: number;
  timestamp: Date;
};

type Notification = {
  id: string;
  myId: number;
  targetId: number;
  type: ChatListNotificationType;
  /** 표시용 시간 (레거시, 마이그레이션용) */
  timestamp: Date;
  /** 목록 정렬·고정용: 최초 생성 시각만 사용 (재방문 시 변경하지 않음) */
  createdAt?: Date;
};

const MyListingsContext = createContext<MyListingsContextType | null>(null);

export type { MyListingItem };

export function MyListingsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MyListingItem[]>(() => getItems());
  const [myListingIds, setMyListingIds] = useState<number[]>(() =>
    pickRandomItems(getItems(), 2).map((i) => i.id)
  );
  const [matches, setMatches] = useState<Match[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

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
      const isDuplicate = prev.some(
        (m) => m.myId === myId && m.targetId === targetId
      );
      if (isDuplicate) return prev;
      const exists = prev.find(m => m.myId === myId && m.targetId === targetId);
      return exists ? prev : [...prev, newMatch];
    });

    console.log("Match Recorded Globally:", newMatch);
  }, []);

  const addNotification = useCallback((myId: number, targetId: number) => {
    const now = new Date();
    const newNotif: Notification = {
      id: Math.random().toString(),
      myId,
      targetId,
      type: 'MATCH_OFFER',
      timestamp: now,
      createdAt: now,
    };
    setNotifications((prev) => {
      const isDuplicate = prev.some(
        (n) => (n.type ?? 'MATCH_OFFER') === 'MATCH_OFFER' && n.myId === myId && n.targetId === targetId
      );
      if (isDuplicate) return prev;

      return [...prev, newNotif];
    });
  }, []);

  const addPurchaseChatEntry = useCallback((itemId: number) => {
    setNotifications((prev) => {
      const exists = prev.some((n) => (n.type ?? 'MATCH_OFFER') === 'PURCHASE' && n.targetId === itemId);
      if (exists) return prev;
      const now = new Date();
      const entry: Notification = {
        id: `purchase-${itemId}-${Date.now()}`,
        myId: 0,
        targetId: itemId,
        type: 'PURCHASE',
        timestamp: now,
        createdAt: now,
      };
      return [...prev, entry];
    });
  }, []);

  const removeNotification = useCallback((myId: number, targetId: number) => {
    setNotifications((prev) =>
      prev.filter(
        (n) =>
          !(
            (n.type ?? 'MATCH_OFFER') === 'MATCH_OFFER' &&
            n.myId === myId &&
            n.targetId === targetId
          )
      )
    );
    setMatches((prev) =>
      prev.filter((m) => !(m.myId === myId && m.targetId === targetId))
    );
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
    () => ({
      items,
      matches,
      recordMatch,
      myListings,
      isMyListing,
      updateItem,
      removeItem,
      getItemById,
      notifications,
      addNotification,
      addPurchaseChatEntry,
      removeNotification,
    }),
    [
      items,
      matches,
      recordMatch,
      myListings,
      isMyListing,
      updateItem,
      removeItem,
      getItemById,
      notifications,
      addNotification,
      addPurchaseChatEntry,
      removeNotification,
    ]
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
