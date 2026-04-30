import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => 'dark',
}));

jest.mock('@/components/themed-text', () => ({
  ThemedText: ({ children, style }: { children: React.ReactNode; style?: any }) => {
    const { Text } = require('react-native');
    return <Text style={style}>{children}</Text>;
  },
}));

jest.mock('@/components/themed-view', () => ({
  ThemedView: ({ children, style }: { children: React.ReactNode; style?: any }) => {
    const { View } = require('react-native');
    return <View style={style}>{children}</View>;
  },
}));

jest.mock('@/components/ui/icon-symbol', () => ({
  IconSymbol: () => null,
}));

jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('expo-symbols', () => ({
  SymbolView: () => null,
}));

jest.mock('@react-navigation/elements', () => ({
  PlatformPressable: ({ children, onPressIn, ...props }: any) => {
    const { TouchableOpacity } = require('react-native');
    return (
      <TouchableOpacity onPress={onPressIn} {...props}>
        {children}
      </TouchableOpacity>
    );
  },
}));

jest.mock('expo-web-browser', () => ({
  openBrowserAsync: jest.fn(),
  WebBrowserPresentationStyle: { AUTOMATIC: 'automatic' },
}));

jest.mock('expo-router', () => ({
  Link: ({ children, onPress, href, ...props }: any) => {
    const { TouchableOpacity, Text } = require('react-native');
    const fakeEvent = { preventDefault: jest.fn() };
    return (
      <TouchableOpacity onPress={() => onPress?.(fakeEvent)} {...props}>
        <Text testID="link-href">{href}</Text>
        {children}
      </TouchableOpacity>
    );
  },
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// --------------- Collapsible ---------------
import { Collapsible } from '../components/ui/collapsible';
import { Text as RNText } from 'react-native';

describe('Collapsible', () => {
  it('renders title and is initially closed', () => {
    render(
      <Collapsible title="Test Section">
        <RNText>Hidden content</RNText>
      </Collapsible>
    );
    expect(screen.getByText('Test Section')).toBeTruthy();
    expect(screen.queryByText('Hidden content')).toBeNull();
  });

  it('toggles open when pressed', async () => {
    render(
      <Collapsible title="Test Section">
        <RNText>Visible content</RNText>
      </Collapsible>
    );

    await act(async () => {
      fireEvent.press(screen.getByText('Test Section'));
    });

    expect(screen.getByText('Visible content')).toBeTruthy();
  });

  it('closes again on second press', async () => {
    render(
      <Collapsible title="Toggle">
        <RNText>Content here</RNText>
      </Collapsible>
    );

    await act(async () => {
      fireEvent.press(screen.getByText('Toggle'));
    });
    expect(screen.getByText('Content here')).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByText('Toggle'));
    });
    expect(screen.queryByText('Content here')).toBeNull();
  });
});

// --------------- IconSymbol (non-iOS) ---------------
import { IconSymbol } from '../components/ui/icon-symbol';

describe('IconSymbol', () => {
  it('renders without crashing', () => {
    expect(() =>
      render(<IconSymbol name="house.fill" size={24} color="#000000" />)
    ).not.toThrow();
  });

  it('renders with default size', () => {
    expect(() =>
      render(<IconSymbol name="heart.fill" color="#FF0000" />)
    ).not.toThrow();
  });
});

// --------------- UserHeader ---------------
import UserHeader from '../components/user-header';
import * as Haptics from 'expo-haptics';

describe('UserHeader', () => {
  it('renders the user name', () => {
    render(
      <UserHeader
        userId={42}
        userLocation="London"
        userRating={4}
        itemId={1}
      />
    );
    expect(screen.getByText('User42')).toBeTruthy();
  });

  it('renders a custom display name', () => {
    render(
      <UserHeader
        userId={1}
        userLocation="Manchester"
        userRating={3}
        itemId={2}
        displayName="Alice"
      />
    );
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('renders the user location', () => {
    render(
      <UserHeader
        userId={5}
        userLocation="Bristol"
        userRating={5}
        itemId={3}
      />
    );
    expect(screen.getByText('Bristol')).toBeTruthy();
  });

  it('calls haptics when the user header is pressed', async () => {
    render(
      <UserHeader
        userId={7}
        userLocation="Leeds"
        userRating={2}
        itemId={4}
      />
    );

    await act(async () => {
      fireEvent.press(screen.getByText('User7'));
    });

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
  });
});

// --------------- HapticTab ---------------
import { HapticTab } from '../components/haptic-tab';

describe('HapticTab', () => {
  it('renders without crashing', () => {
    const mockOnPressIn = jest.fn();
    expect(() =>
      render(<HapticTab onPressIn={mockOnPressIn} />)
    ).not.toThrow();
  });

  it('calls the passed onPressIn when the pressable is triggered', async () => {
    const mockOnPressIn = jest.fn();
    const { UNSAFE_getByType } = render(<HapticTab onPressIn={mockOnPressIn} />);
    const { TouchableOpacity } = require('react-native');
    const pressable = UNSAFE_getByType(TouchableOpacity);

    await act(async () => {
      fireEvent.press(pressable);
    });

    expect(mockOnPressIn).toHaveBeenCalled();
  });
});

// --------------- ExternalLink ---------------
import { ExternalLink } from '../components/external-link';
import { openBrowserAsync } from 'expo-web-browser';

describe('ExternalLink', () => {
  it('renders without crashing', () => {
    expect(() =>
      render(<ExternalLink href="https://example.com" />)
    ).not.toThrow();
  });

  it('opens the browser when pressed on native', async () => {
    render(<ExternalLink href="https://example.com" />);

    await act(async () => {
      fireEvent.press(screen.getByTestId('link-href'));
    });

    expect(openBrowserAsync).toHaveBeenCalledWith(
      'https://example.com',
      expect.objectContaining({ presentationStyle: 'automatic' })
    );
  });
});

// --------------- HelloWave ---------------
import { HelloWave } from '../components/hello-wave';

describe('HelloWave', () => {
  it('renders without crashing', () => {
    expect(() => render(<HelloWave />)).not.toThrow();
  });
});
