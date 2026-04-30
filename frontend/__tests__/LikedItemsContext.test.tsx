import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { LikedItemsProvider, useLikedItems } from '../contexts/LikedItemsContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LikedItemsProvider>{children}</LikedItemsProvider>
);

describe('LikedItemsContext', () => {
  it('starts with an empty likedMap and likedOrder', () => {
    const { result } = renderHook(() => useLikedItems(), { wrapper });
    expect(result.current.likedMap).toEqual({});
    expect(result.current.likedOrder).toEqual([]);
  });

  it('toggleLike adds an item to likedMap and likedOrder', () => {
    const { result } = renderHook(() => useLikedItems(), { wrapper });

    act(() => {
      result.current.toggleLike(1);
    });

    expect(result.current.likedMap['1']).toBe(true);
    expect(result.current.likedOrder).toContain(1);
  });

  it('toggleLike removes an item when it is already liked', () => {
    const { result } = renderHook(() => useLikedItems(), { wrapper });

    act(() => {
      result.current.toggleLike(2);
    });
    act(() => {
      result.current.toggleLike(2);
    });

    expect(result.current.likedMap['2']).toBe(false);
    expect(result.current.likedOrder).not.toContain(2);
  });

  it('clearAllLikes empties likedMap and likedOrder', () => {
    const { result } = renderHook(() => useLikedItems(), { wrapper });

    act(() => {
      result.current.toggleLike(3);
      result.current.toggleLike(4);
    });
    act(() => {
      result.current.clearAllLikes();
    });

    expect(result.current.likedMap).toEqual({});
    expect(result.current.likedOrder).toEqual([]);
  });

  it('setLikedOrder replaces the current order', () => {
    const { result } = renderHook(() => useLikedItems(), { wrapper });

    act(() => {
      result.current.setLikedOrder([5, 6, 7]);
    });

    expect(result.current.likedOrder).toEqual([5, 6, 7]);
  });

  it('isLiked returns true for a liked item', () => {
    const { result } = renderHook(() => useLikedItems(), { wrapper });

    act(() => {
      result.current.toggleLike(8);
    });

    expect(result.current.isLiked(8)).toBe(true);
    expect(result.current.isLiked('8')).toBe(true);
  });

  it('isLiked returns false for an item that has not been liked', () => {
    const { result } = renderHook(() => useLikedItems(), { wrapper });
    expect(result.current.isLiked(99)).toBe(false);
  });

  it('toggleLike accepts string ids', () => {
    const { result } = renderHook(() => useLikedItems(), { wrapper });

    act(() => {
      result.current.toggleLike('10');
    });

    expect(result.current.likedMap['10']).toBe(true);
    expect(result.current.likedOrder).toContain(10);
  });

  it('useLikedItems throws when used outside LikedItemsProvider', () => {
    expect(() => {
      renderHook(() => useLikedItems());
    }).toThrow('useLikedItems must be used within LikedItemsProvider');
  });
});
