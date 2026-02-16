import { render } from '@testing-library/react-native';
import { ThemedView } from '../components/themed-view';
import { useColorScheme } from 'react-native';

jest.mock('react-native/Libraries/Utilities/useColorScheme');

describe('ThemedView', () => {
    it('renders correctly in light mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue('light');
    const { getByTestId } = render(<ThemedView testID="themed-view" />);

    expect(getByTestId('themed-view')).toHaveStyle({ backgroundColor: '#fff' });
    });

    it('renders correctly in dark mode', () => {
        (useColorScheme as jest.Mock).mockReturnValue('dark');
    const { getByTestId } = render(<ThemedView testID="themed-view" />);

    expect(getByTestId('themed-view')).toHaveStyle({ backgroundColor: '#151718' });
    });
})