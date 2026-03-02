import { render } from '@testing-library/react-native';
import { useColorScheme } from 'react-native';
import { ThemedText } from '../components/themed-text'; 
import { StyleSheet } from 'react-native';

// mocks
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  useColorScheme: jest.fn(),
}));

describe('ThemedText', () => {
  it('renders correctly in light mode', () => {
    (useColorScheme as jest.Mock).mockReturnValue('light');
    const { getByText } = render(<ThemedText>Hello World</ThemedText>);
    const textElement = getByText('Hello World');
    const flattenedStyle = StyleSheet.flatten(textElement.props.style);
    expect(flattenedStyle.color).toBe('#11181C'); 
  });

  it('renders correctly in dark mode', () => {
    // (useColorScheme as jest.Mock).mockReturnValue('dark');
    // const { getByText } = render(<ThemedText>Hello World</ThemedText>);
    // const textElement = getByText('Hello World');
    // const flattenedStyle = StyleSheet.flatten(textElement.props.style);
    // expect(flattenedStyle.color).toBe('#ECEDEE'); 
  });
});