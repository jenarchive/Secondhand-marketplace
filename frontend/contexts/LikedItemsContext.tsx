'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type LikedMap = Record<string, boolean>;

type LikedItemsContextType = {
  likedMap: LikedMap;
  likedOrder: number[];
  toggleLike: (id: string | number) => void;
  clearAllLikes: () => void;
  setLikedOrder: (order: number[]) => void;
  isLiked: (id: string | number) => boolean;
};

export const LikedItemsContext = createContext<LikedItemsContextType | null>(null);

export function LikedItemsProvider({ children }: { children: React.ReactNode }) {
  const [likedMap, setLikedMap] = useState<LikedMap>({});
  const [likedOrder, setLikedOrderState] = useState<number[]>([]);

  const toggleLike = useCallback((id: string | number) => {
    const key = String(id);
    const numId = Number(id);
    setLikedMap((prev) => {
      const wasLiked = prev[key];
      setLikedOrderState((prevOrder) =>
        wasLiked ? prevOrder.filter((x) => x !== numId) : [...prevOrder, numId]
      );
      return { ...prev, [key]: !wasLiked };
    });
  }, []);

  const clearAllLikes = useCallback(() => {
    setLikedMap({});
    setLikedOrderState([]);
  }, []);

  const setLikedOrder = useCallback((order: number[]) => {
    setLikedOrderState(order);
  }, []);

  const isLiked = useCallback((id: string | number) => {
    return likedMap[String(id)] ?? false;
  }, [likedMap]);

  return (
    <LikedItemsContext.Provider value={{ likedMap, likedOrder, toggleLike, clearAllLikes, setLikedOrder, isLiked }}>
      {children}
    </LikedItemsContext.Provider>
  );
}

export function useLikedItems() {
  const ctx = useContext(LikedItemsContext);
  if (!ctx) {
    throw new Error('useLikedItems must be used within LikedItemsProvider');
  }
  return ctx;
}
