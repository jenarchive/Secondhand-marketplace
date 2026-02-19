'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type LikedMap = Record<string, boolean>;

type LikedItemsContextType = {
  likedMap: LikedMap;
  toggleLike: (id: string | number) => void;
  isLiked: (id: string | number) => boolean;
};

const LikedItemsContext = createContext<LikedItemsContextType | null>(null);

export function LikedItemsProvider({ children }: { children: React.ReactNode }) {
  const [likedMap, setLikedMap] = useState<LikedMap>({});

  const toggleLike = useCallback((id: string | number) => {
    const key = String(id);
    setLikedMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const isLiked = useCallback((id: string | number) => {
    return likedMap[String(id)] ?? false;
  }, [likedMap]);

  return (
    <LikedItemsContext.Provider value={{ likedMap, toggleLike, isLiked }}>
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
