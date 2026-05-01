import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

const mockBack = jest.fn();
const mockReplace = jest.fn();

jest.mock('expo-router', () => {
  const { View } = require('react-native');

  const MockScreen = ({ options, name }: any) => {
    const headerLeft = options?.headerLeft ? options.headerLeft() : null;
    return (
      <View testID={`screen-${name}`}>
        {headerLeft}
      </View>
    );
  };

  const MockStack = ({ children, screenOptions }: any) => {
    const { View } = require('react-native');
    const headerLeft = screenOptions?.headerLeft ? screenOptions.headerLeft() : null;
    return (
      <View testID="mock-stack">
        {headerLeft}
        {children}
      </View>
    );
  };
  MockStack.Screen = MockScreen;

  return {
    Stack: MockStack,
    useRouter: jest.fn(() => ({
      back: mockBack,
      replace: mockReplace,
    })),
  };
});

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('@/hooks/use-theme-color', () => ({
  useThemeColor: () => '#000000',
}));

jest.mock('@react-navigation/native', () => ({
  DarkTheme: { dark: true, colors: {} },
  ThemeProvider: ({ children }: any) => children,
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: any) => children,
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return Reanimated;
});

jest.mock('@/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: any) => children,
}));

jest.mock('@/contexts/LikedItemsContext', () => ({
  LikedItemsProvider: ({ children }: any) => children,
}));

jest.mock('@/contexts/MyListingsContext', () => ({
  MyListingsProvider: ({ children }: any) => children,
}));

jest.mock('@/store/myListingsStore', () => ({
  getItems: jest.fn(() => []),
  setItems: jest.fn(),
  subscribe: jest.fn(),
}));

// --------------- app/_layout.tsx ---------------
import RootLayout from '../app/_layout';

describe('RootLayout', () => {
  it('renders without crashing', () => {
    expect(() => render(<RootLayout />)).not.toThrow();
  });
});

// --------------- app/items/_layout.tsx ---------------
import ItemsLayout from '../app/items/_layout';

describe('ItemsLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    expect(() => render(<ItemsLayout />)).not.toThrow();
  });

  it('renders the items stack', () => {
    const { getByTestId } = render(<ItemsLayout />);
    expect(getByTestId('mock-stack')).toBeTruthy();
  });

  it('calls router.back() when the headerLeft back button is pressed', () => {
    const { UNSAFE_getAllByType } = render(<ItemsLayout />);
    const { TouchableOpacity } = require('react-native');
    const buttons = UNSAFE_getAllByType(TouchableOpacity);
    fireEvent.press(buttons[0]);
    expect(mockBack).toHaveBeenCalled();
  });
});

// --------------- app/items/edit/_layout.tsx ---------------
import EditLayout from '../app/items/edit/_layout';

describe('EditLayout', () => {
  it('renders without crashing', () => {
    expect(() => render(<EditLayout />)).not.toThrow();
  });
});
