import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/profile'; 
import { useAuth } from '@/contexts/AuthContext';

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: React.ReactNode }) => children,
  Href: {},
}));

global.fetch = jest.fn();

describe('HomeScreen Auth & Effects', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders AuthGate when user is NOT logged in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: false,
      token: null,
      logout: mockLogout,
    });

    render(<HomeScreen />);

    expect(screen.getByText('Welcome')).toBeTruthy();
    expect(screen.getByText('Log In')).toBeTruthy();
    expect(screen.getByText('Sign Up')).toBeTruthy();
  });

  it('renders Profile and List when user IS logged in', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      token: 'mock-token',
      logout: jest.fn(),
    });

    const mockUser = { username: 'TestUser' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      ok: true, 
      json: async () => mockUser,
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText(/TestUser/i)).toBeTruthy();
    }, { timeout: 2000 }); 

    expect(screen.getByText('T')).toBeTruthy();
    
    expect(screen.getByText('My Chats')).toBeTruthy();
  });

  it('calls logout if the fetch returns a 401 Unauthorized', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      token: 'expired-token',
      logout: mockLogout,
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 401,
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('correctly sets the avatar initial based on fetched username', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      token: 'valid-token',
      logout: mockLogout,
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      status: 200,
      json: async () => ({ username: 'Alex' }),
    });

    render(<HomeScreen />);

    await waitFor(() => {
      expect(screen.getByText('A')).toBeTruthy();
    });
  });
  
  it('contains a Log Out option in the list', () => {
    (useAuth as jest.Mock).mockReturnValue({ isLoggedIn: true });
    render(<HomeScreen />);
    expect(screen.getByText('Log Out')).toBeTruthy();
  });
});