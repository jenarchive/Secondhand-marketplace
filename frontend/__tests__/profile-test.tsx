import { router } from 'expo-router'; 
import { render, userEvent } from '@testing-library/react-native';
import HomeScreen from "../app/(tabs)/profile";

jest.mock('expo-router', () => {
  const pushMock = jest.fn();
  const React = require('react');
  const { Pressable } = require('react-native');

  return {
    __esModule: true,
    router: { push: pushMock },

    Link: ({ href, children }: any) => (
      <Pressable
        accessibilityRole="link"
        accessibilityLabel={typeof children === 'string' ? children : 'link'}
        onPress={() => pushMock(href)}
      >
        {children}
      </Pressable>
    ),
  };
});

describe('ProfileLink', () => {
  it('navigates to edit-profile when pressed', async () => {
    // const { getByRole  } = render(<HomeScreen />);
    // const user = userEvent.setup();

    // await user.press(getByRole('link', { name: 'Username' }));

    // expect(router.push).toHaveBeenCalledWith('../items/edit-profile');
  });
});