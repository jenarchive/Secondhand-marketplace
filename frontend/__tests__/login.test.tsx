import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../app/auth/login';
import { useAuth } from '@/contexts/AuthContext';

const mockReplace = jest.fn();
const mockBack = jest.fn();
const mockLogin = jest.fn();

jest.mock('expo-router', () => ({
	useRouter: () => ({
		replace: mockReplace,
		back: mockBack,
	}),
	Stack: {
		Screen: () => null,
	},
}));

jest.mock('@/contexts/AuthContext', () => ({
	useAuth: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
	useThemeColor: () => '#000000',
}));

jest.mock('@expo/vector-icons', () => ({
	Ionicons: () => null,
}));

global.fetch = jest.fn();

describe('LoginScreen', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		(useAuth as jest.Mock).mockReturnValue({ login: mockLogin });
	});

	it('renders the login form', () => {
		render(<LoginScreen />);

		expect(screen.getAllByText('Log In')).toBeTruthy();
		expect(screen.getByPlaceholderText('Email')).toBeTruthy();
		expect(screen.getByPlaceholderText('Password')).toBeTruthy();
	});

	it('shows a validation message when fields are empty', async () => {
		render(<LoginScreen />);

		fireEvent.press(screen.getAllByText('Log In')[1]);

		expect(screen.getByText('Email and password are required.')).toBeTruthy();
		expect(global.fetch).not.toHaveBeenCalled();
		expect(mockLogin).not.toHaveBeenCalled();
		expect(mockReplace).not.toHaveBeenCalled();
	});

	it('logs in successfully and redirects to profile', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => ({ access_token: 'token-123' }),
		});

		render(<LoginScreen />);

		fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
		fireEvent.changeText(screen.getByPlaceholderText('Password'), 'secret-password');
		fireEvent.press(screen.getAllByText('Log In')[1]);

		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				'http://18.133.255.151/test/auth/login',
				expect.objectContaining({
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: 'test@example.com',
						password: 'secret-password',
					}),
				})
			);
			expect(mockLogin).toHaveBeenCalledWith('token-123');
			expect(mockReplace).toHaveBeenCalledWith('/(tabs)/profile');
		});
	});

	it('shows an error when the server rejects the login', async () => {
		(global.fetch as jest.Mock).mockResolvedValueOnce({
			ok: false,
			json: async () => ({ error: 'Invalid credentials' }),
		});

		render(<LoginScreen />);

		fireEvent.changeText(screen.getByPlaceholderText('Email'), 'test@example.com');
		fireEvent.changeText(screen.getByPlaceholderText('Password'), 'wrong-password');
		fireEvent.press(screen.getAllByText('Log In')[1]);

		await waitFor(() => {
			expect(screen.getByText('Invalid credentials')).toBeTruthy();
		});

		expect(mockLogin).not.toHaveBeenCalled();
		expect(mockReplace).not.toHaveBeenCalled();
	});
});
