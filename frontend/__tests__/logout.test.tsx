import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import LogoutScreen from '../app/items/logout';
import { useAuth } from '@/contexts/AuthContext';

const mockReplace = jest.fn();
const mockLogout = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('LogoutScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ logout: mockLogout });
  });

  it('calls logout on mount', async () => {
    render(<LogoutScreen />);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  it('redirects to profile after logout', async () => {
    render(<LogoutScreen />);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/profile');
    });
  });

});
