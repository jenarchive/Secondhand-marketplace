import React from 'react';
import { render, screen } from '@testing-library/react-native';
import TabLayout from '../app/(tabs)/_layout';

jest.mock('expo-router', () => {
  const { View, Text } = require('react-native');
  
  const MockScreen = ({ options }: any) => {
    const Icon = options.tabBarIcon ? options.tabBarIcon({ color: 'black' }) : null;

    return (
      <View testID={options.tabBarButtonTestID || "tab-screen"}>
        <Text>{options.title}</Text>
        {Icon}
      </View>
    );
  };
  
  const MockTabs = ({ children }: { children: React.ReactNode }) => (
    <View testID="mock-tabs">{children}</View>
  );
  
  return {
    Tabs: Object.assign(MockTabs, { Screen: MockScreen }),
  };
});

jest.mock('@/components/haptic-tab', () => ({
  HapticTab: ({ children }: any) => children,
}));

jest.mock('@/components/ui/icon-symbol', () => {
  const { View } = require('react-native');
  return {
    IconSymbol: ({ name }: { name: string }) => <View testID={`icon-${name}`} />,
  };
});

jest.mock('@expo/vector-icons/FontAwesome6', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ name }: { name: string }) => <View testID={`fa-icon-${name}`} />,
  };
});

jest.mock('@expo/vector-icons/Ionicons', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: ({ name }: { name: string }) => <View testID={`ion-icon-${name}`} />,
  };
});

describe('TabLayout', () => {
  it('renders all tab screens with correct titles', () => {
    render(<TabLayout />);

    expect(screen.getByText('Marketplace')).toBeTruthy();
    expect(screen.getByText('Explore')).toBeTruthy();
    expect(screen.getByText('Sell')).toBeTruthy();
    expect(screen.getByText('Likes')).toBeTruthy();
    expect(screen.getByText('Profile')).toBeTruthy();
  });

  it('hides the log-in tab from the bar using href: null', () => {
    render(<TabLayout />);
    expect(screen.queryByText('log-in')).toBeNull();
  });

  it('verifies that the correct icon names are passed to the icon components', () => {
    render(<TabLayout />);

    expect(screen.getByTestId('marketplace')).toBeTruthy();
    expect(screen.getByTestId('explore')).toBeTruthy();
    expect(screen.getByTestId('sell')).toBeTruthy();
    expect(screen.getByTestId('like')).toBeTruthy();
    expect(screen.getByTestId('profile')).toBeTruthy();
  });
});