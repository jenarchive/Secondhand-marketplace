import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react-native';
import { FlatList } from 'react-native';
import * as Haptics from 'expo-haptics';

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
}));

jest.mock('expo-router', () => {
  const React = require('react');
  const { View } = require('react-native');
  const actual = jest.requireActual('expo-router');
  return {
    ...actual,
    useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
    Stack: {
      Screen: jest.fn(({ options }) => (
        <View testID="mock-stack-header">
          <View testID="header-left-container">
            {options?.headerLeft ? options.headerLeft() : null}
          </View>
          <View testID="header-right-container">
            {options?.headerRight ? options.headerRight() : null}
          </View>
        </View>
      )),
    },
  };
});

type ListRenderItemInfo<T> = {
  item: T;
  index: number;
  separators: any;
};

jest.mock('react-native-draggable-flatlist', () => {
  const React = require('react');
  const { FlatList } = require('react-native');

  // Default export: wrapper around FlatList that adapts renderItem signature
  const DraggableFlatListMock: React.FC<any> = ({ data, renderItem, keyExtractor, ...props }) => {
    return (
      <FlatList
        {...props}
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item, index, separators }: ListRenderItemInfo<any>) =>
          // Call the original renderItem with the DraggableFlatList shape:
          renderItem({
            item,
            drag: () => {},           // no-op drag for tests
            isActive: false,
            getIndex: () => index,
            index,
            separators,
          })
        }
      />
    );
  };

  const ScaleDecorator: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    return <>{children}</>;
  };

  return {
    __esModule: true,
    default: DraggableFlatListMock,
    ScaleDecorator,
  };
});

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@expo/vector-icons', () => ({ Ionicons: 'View' }));

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useFocusEffect: jest.fn((callback) => callback()),
  };
});

import LikedItemsScreen from '../app/(tabs)/liked-items';
import { LikedItemsContext } from '@/contexts/LikedItemsContext';

const renderWithContext = (likedMap = { '1': true }, likedOrder = [1]) => {
  const mockToggleLike = jest.fn();
  const mockClearAllLikes = jest.fn();

  const view = render(
    <LikedItemsContext.Provider
      value={{
        likedMap,
        likedOrder,
        toggleLike: mockToggleLike,
        clearAllLikes: mockClearAllLikes,
        setLikedOrder: jest.fn(),
      } as any}
    >
      <LikedItemsScreen />
    </LikedItemsContext.Provider>
  );

  return {
    ...view,
    mockToggleLike,
    mockClearAllLikes,
  };
};

describe('LikedItemsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  it('renders a list of liked items', () => {
    renderWithContext({ '1': true }, [1]);
    expect(screen.getByText(/Used Bicycle/i)).toBeTruthy();
    expect(screen.getByText(/£150.00/)).toBeTruthy();
  });

  it('successfully enters edit mode and deletes an item', async () => {
    const { mockToggleLike } = renderWithContext({ '1': true }, [1]);

    const headerRightPressable = screen.getByTestId('header-right-pressable');
    await act(async () => {
      fireEvent.press(headerRightPressable);
    });

    const deleteButton = await screen.findByText('Delete');
    await act(async () => {
      fireEvent.press(deleteButton);
    });

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(mockToggleLike).toHaveBeenCalledWith(1);
  });

  it('shows Clear All only after entering edit mode', async () => {
    renderWithContext({ '1': true }, [1]);
    expect(screen.queryByText('Clear all')).toBeNull();

    const headerRightPressable = screen.getByTestId('header-right-pressable');
    await act(async () => {
      fireEvent.press(headerRightPressable);
    });

    await waitFor(() => {
      const clearPressable = screen.queryByTestId('header-left-clear-pressable');
      if (clearPressable) {
        expect(clearPressable).toBeTruthy();
      } else {
        expect(screen.getByText('Clear all')).toBeTruthy();
      }
    });
  });
});
