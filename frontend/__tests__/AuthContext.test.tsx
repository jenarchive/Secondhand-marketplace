import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue(null);
  });

  it('starts with no token and isLoggedIn as false', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => {
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.token).toBeNull();
    });
  });

  it('login sets the token and marks isLoggedIn as true', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.login('my-token-123');
    });

    expect(result.current.token).toBe('my-token-123');
    expect(result.current.isLoggedIn).toBe(true);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('auth_token', 'my-token-123');
  });

  it('logout clears the token and sets isLoggedIn to false', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      result.current.login('my-token-123');
    });

    await act(async () => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
  });

  it('restores a stored token from SecureStore on mount', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('stored-token');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.token).toBe('stored-token');
      expect(result.current.isLoggedIn).toBe(true);
    });
  });

  it('useAuth throws when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within AuthProvider');
  });
});
