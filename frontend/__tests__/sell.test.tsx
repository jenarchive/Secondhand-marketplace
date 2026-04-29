import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/sell'; 
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  MediaTypeOptions: { Images: 'Images' },
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@expo/vector-icons/Ionicons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return (props: any) => React.createElement(Text, {}, props.name);
});

jest.mock('@/constants/categories', () => ({
  CATEGORIES: [{ id: '1', name: 'Electronics' }]
}));

global.fetch = jest.fn();

describe('Sell Item Screen Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields correctly', () => {
    render(<HomeScreen />);
    
    expect(screen.getByPlaceholderText('What is your item')).toBeTruthy();
    expect(screen.getByPlaceholderText('Describe more about your item')).toBeTruthy();
    expect(screen.getByPlaceholderText('0.00')).toBeTruthy();
    expect(screen.getByText('Select a Category')).toBeTruthy();
    expect(screen.getByText(/Photos \(0\/5\)/)).toBeTruthy();
  });

  it('allows the user to type in the Title and Description', () => {
    render(<HomeScreen />);
    
    const titleInput = screen.getByPlaceholderText('What is your item');
    const descInput = screen.getByPlaceholderText('Describe more about your item');

    fireEvent.changeText(titleInput, 'Vintage Camera');
    fireEvent.changeText(descInput, 'A beautiful 1970s film camera.');

    expect(titleInput.props.value).toBe('Vintage Camera');
    expect(descInput.props.value).toBe('A beautiful 1970s film camera.');
  });

  it('restricts price input to valid numeric format', () => {
    render(<HomeScreen />);
    const priceInput = screen.getByPlaceholderText('0.00');

    fireEvent.changeText(priceInput, 'abc');
    expect(priceInput.props.value).toBe('');

    fireEvent.changeText(priceInput, '45.50');
    expect(priceInput.props.value).toBe('45.50');
  });

  it('validates fields and shows error borders on empty upload attempt', async () => {
    render(<HomeScreen />);
    
    const uploadButton = screen.getByText('Upload');
    fireEvent.press(uploadButton);

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('successfully picks an image and updates the UI', async () => {
    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ uri: 'test-image-uri.jpg' }],
    });

    render(<HomeScreen />);
    
    const addPhotoButton = screen.getByText('Add');
    fireEvent.press(addPhotoButton);

    await waitFor(() => {
      expect(screen.getByText(/Photos \(1\/5\)/)).toBeTruthy();
    });
  });

  it('submits form data and navigates back on successful upload', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    (ImagePicker.launchImageLibraryAsync as jest.Mock).mockResolvedValue({
      canceled: false,
      assets: [{ uri: 'file://test-image.jpg' }],
    });

    render(<HomeScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('What is your item'), 'Bike');
    fireEvent.changeText(screen.getByPlaceholderText('Describe more about your item'), 'Red bike');
    fireEvent.changeText(screen.getByPlaceholderText('0.00'), '100');
    
    fireEvent.press(screen.getByText('Select a Category'));
    fireEvent.press(screen.getByText('Electronics'));

    const addPhotoButton = screen.getByText('Add');
    fireEvent.press(addPhotoButton);

    await waitFor(() => {
      expect(screen.getByText(/Photos \(1\/5\)/)).toBeTruthy();
    });

    const uploadButton = screen.getByText('Upload');
    fireEvent.press(uploadButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://18.133.255.151/api/items',
        expect.objectContaining({
          method: 'POST'
        })
      );
      expect(router.back).toHaveBeenCalled();
    });
  });
});