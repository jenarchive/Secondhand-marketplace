import { render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../components/themed-text';

describe('ThemedText', () => {
  it('uses dark theme text color (app is locked to dark mode)', () => {
    const { getByText } = render(<ThemedText>Hello World</ThemedText>);
    const textElement = getByText('Hello World');
    const flattenedStyle = StyleSheet.flatten(textElement.props.style);
    expect(flattenedStyle.color).toBe('#ECEDEE');
  });
});
