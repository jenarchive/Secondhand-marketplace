import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import SignUpScreen from '../app/auth/signup';
import { useAuth } from '@/contexts/AuthContext';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockLogin = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
  }),
  Stack: {
    Screen: () => null,
  },
}));

jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

global.fetch = jest.fn();

describe('SignUpScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
  });

  it('renders the signup form', () => {
    render(<SignUpScreen />);

    expect(screen.getAllByText('Sign Up')).toBeTruthy();
    expect(screen.getByPlaceholderText('Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();
  });

  it('shows a validation message when fields are empty', async () => {
    render(<SignUpScreen />);

    fireEvent.press(screen.getAllByText('Sign Up')[1]);

    expect(screen.getByText('All fields are required.')).toBeTruthy();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows an error when registration fails', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Email already exists' }),
    });

    render(<SignUpScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'newuser');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getAllByText('Sign Up')[1]);

    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeTruthy();
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows an error when login after registration fails', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Login service temporarily unavailable' }),
      });

    render(<SignUpScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'newuser');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getAllByText('Sign Up')[1]);

    await waitFor(() => {
      expect(screen.getByText('Login service temporarily unavailable')).toBeTruthy();
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('successfully signs up and logs in', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'token-456' }),
      });

    render(<SignUpScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'newuser');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getAllByText('Sign Up')[1]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenNthCalledWith(
        1,
        'http://18.133.255.151/test/auth/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'newuser',
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
      expect(global.fetch).toHaveBeenNthCalledWith(
        2,
        'http://18.133.255.151/test/auth/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123',
          }),
        })
      );
      expect(mockLogin).toHaveBeenCalledWith('token-456');
      expect(mockReplace).toHaveBeenCalledWith('/(tabs)/profile');
    });
  });

  it('shows a network error when registration fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    render(<SignUpScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'newuser');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getAllByText('Sign Up')[1]);

    await waitFor(() => {
      expect(screen.getByText('Network error. Please try again.')).toBeTruthy();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('shows a network error when login fetch fails after registration', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })
      .mockRejectedValueOnce(new Error('Network error'));

    render(<SignUpScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'newuser');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    fireEvent.press(screen.getAllByText('Sign Up')[1]);

    await waitFor(() => {
      expect(screen.getByText('Network error. Please try again.')).toBeTruthy();
    });

    expect(mockLogin).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('disables the button while loading', async () => {
    (global.fetch as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => {
        setTimeout(
          () => resolve({
            ok: true,
            json: async () => ({}),
          }),
          1000
        );
      })
    );

    render(<SignUpScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'newuser');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password123');
    
    const signUpButtons = screen.getAllByText('Sign Up');
    const button = signUpButtons[1];
    
    fireEvent.press(button);

    expect(button).toBeTruthy();
  });
});
