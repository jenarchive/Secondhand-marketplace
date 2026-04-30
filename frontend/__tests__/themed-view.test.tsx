import { render } from '@testing-library/react-native';
import { ThemedView } from '../components/themed-view';

describe('ThemedView', () => {
  it('uses dark theme background (app is locked to dark mode)', () => {
    const { getByTestId } = render(<ThemedView testID="themed-view" />);
    expect(getByTestId('themed-view')).toHaveStyle({ backgroundColor: '#151718' });
  });

  it('respects darkColor prop override', () => {
    const { getByTestId } = render(
      <ThemedView testID="themed-view" darkColor="#334155" />,
    );
    expect(getByTestId('themed-view')).toHaveStyle({ backgroundColor: '#334155' });
  });
});
