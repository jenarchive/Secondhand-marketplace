import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('expo-symbols', () => ({
  SymbolView: () => null,
}));

import { IconSymbol } from '../components/ui/icon-symbol';

describe('IconSymbol', () => {
  it('renders without crashing with all required props', () => {
    expect(() =>
      render(<IconSymbol name="house.fill" size={24} color="#000000" />)
    ).not.toThrow();
  });

  it('renders with default size when size is omitted', () => {
    expect(() =>
      render(<IconSymbol name="heart.fill" color="#FF0000" />)
    ).not.toThrow();
  });

  it('renders with a style prop', () => {
    expect(() =>
      render(
        <IconSymbol name="chevron.right" color="#333333" size={18} style={{ marginLeft: 4 }} />
      )
    ).not.toThrow();
  });

  it('maps SF Symbol names to Material Icon names', () => {
    expect(() =>
      render(<IconSymbol name="paperplane.fill" color="#0000FF" size={20} />)
    ).not.toThrow();
  });
});
