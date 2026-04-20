jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(() => Promise.resolve(null)),
  setItemAsync: jest.fn(() => Promise.resolve()),
  deleteItemAsync: jest.fn(() => Promise.resolve()),
}));

import HomeScreen from '../app/(tabs)/profile';

describe('ProfileScreen', () => {
  it('exports screen component', () => {
    expect(HomeScreen).toBeDefined();
  });
});
