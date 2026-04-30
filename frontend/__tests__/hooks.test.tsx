import { renderHook } from '@testing-library/react-native';
import { useColorScheme } from '../hooks/use-color-scheme';
import { useThemeColor } from '../hooks/use-theme-color';

describe('useColorScheme', () => {
  it('returns "dark"', () => {
    const { result } = renderHook(() => useColorScheme());
    expect(result.current).toBe('dark');
  });
});

describe('useThemeColor', () => {
  it('returns the dark color from props when the scheme is dark', () => {
    const { result } = renderHook(() => useThemeColor({ dark: '#custom-dark' }, 'background'));
    expect(result.current).toBe('#custom-dark');
  });

  it('falls back to Colors.dark.background when no dark prop is provided', () => {
    const { result } = renderHook(() => useThemeColor({}, 'background'));
    expect(result.current).toBe('#151718');
  });

  it('falls back to Colors.dark.text when no dark prop is provided', () => {
    const { result } = renderHook(() => useThemeColor({}, 'text'));
    expect(result.current).toBe('#ECEDEE');
  });

  it('ignores the light prop when scheme is dark', () => {
    const { result } = renderHook(() => useThemeColor({ light: '#should-not-appear' }, 'text'));
    expect(result.current).toBe('#ECEDEE');
  });

  it('returns tabIconDefault color from the theme', () => {
    const { result } = renderHook(() => useThemeColor({}, 'tabIconDefault'));
    expect(result.current).toBe('#9BA1A6');
  });
});
