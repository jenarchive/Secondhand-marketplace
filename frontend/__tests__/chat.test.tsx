import React from 'react';
import { Alert, Text } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import ChatScreen from '../app/items/chat';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMyListings } from '@/contexts/MyListingsContext';
import { addMessageForItem, getMessagesForItem } from '@/store/chatStore';

const mockBack = jest.fn();
const mockReplace = jest.fn();
const mockPush = jest.fn();
const mockRemoveNotification = jest.fn();
const mockGetItemById = jest.fn();

jest.mock('expo-router', () => ({
	Stack: { Screen: () => null },
	useLocalSearchParams: jest.fn(),
	useRouter: jest.fn(),
}));

jest.mock('@/contexts/MyListingsContext', () => ({
	useMyListings: jest.fn(),
}));

jest.mock('@/store/chatStore', () => ({
	addMessageForItem: jest.fn(),
	getMessagesForItem: jest.fn(),
}));

jest.mock('@/hooks/use-theme-color', () => ({
	useThemeColor: () => '#000000',
}));

jest.mock('@/hooks/use-color-scheme', () => ({
	useColorScheme: () => 'light',
}));

jest.mock('react-native-safe-area-context', () => ({
	useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@expo/vector-icons', () => ({
	Ionicons: () => null,
}));

jest.mock('expo-image', () => ({
	Image: () => null,
}));

jest.mock('expo-image-picker', () => ({
	requestMediaLibraryPermissionsAsync: jest.fn(),
	launchImageLibraryAsync: jest.fn(),
}));

jest.mock('@/components/user-header', () => () => null);
jest.mock('@/components/themed-view', () => ({
	ThemedView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
jest.mock('@/components/themed-text', () => ({
	ThemedText: ({ children }: { children: React.ReactNode }) => {
		const { Text } = require('react-native');
		return <Text>{children}</Text>;
	},
}));

jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

const mockItem = {
	id: 1,
	title: 'My Guitar',
	description: 'Electric guitar in good condition',
	image: 'https://example.com/guitar.jpg',
	price: 200,
	category: 'Musical Instruments',
	location: 'London',
};

const mockTargetItem = {
	id: 2,
	title: 'Vintage Camera',
	description: 'Classic film camera',
	image: 'https://example.com/camera.jpg',
	price: 150,
	category: 'Electronics',
	location: 'Manchester',
};

const renderChat = (params: Partial<Record<string, string>> = {}) => {
	(useLocalSearchParams as jest.Mock).mockReturnValue({
		myId: '1',
		targetId: '2',
		sellerName: 'Seller Two',
		source: 'explore',
		fromMarketplace: 'false',
		fromExplore: 'true',
		fromLikedItems: 'false',
		fromTransaction: 'false',
		...params,
	});

	(useRouter as jest.Mock).mockReturnValue({
		back: mockBack,
		replace: mockReplace,
		push: mockPush,
		canGoBack: () => false,
	});

	(useMyListings as jest.Mock).mockReturnValue({
		items: [mockItem, mockTargetItem],
		getItemById: mockGetItemById,
		removeNotification: mockRemoveNotification,
	});

	mockGetItemById.mockImplementation((id) => {
		if (id === 1) return mockItem;
		if (id === 2) return mockTargetItem;
		return undefined;
	});

	(getMessagesForItem as jest.Mock).mockReturnValue([]);
	(addMessageForItem as jest.Mock).mockImplementation((chatKey, text) => ({
		sentAt: 1234567890,
		text,
		chatKey,
	}));

	return render(<ChatScreen />);
};

describe('ChatScreen', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('shows an item not found state when the target item is missing', () => {
		(useLocalSearchParams as jest.Mock).mockReturnValue({
			myId: '1',
			targetId: '999',
		});

		(useRouter as jest.Mock).mockReturnValue({
			back: mockBack,
			replace: mockReplace,
			push: mockPush,
			canGoBack: () => false,
		});

		(useMyListings as jest.Mock).mockReturnValue({
			items: [mockItem],
			getItemById: (id: number) => (id === 1 ? mockItem : undefined),
			removeNotification: mockRemoveNotification,
		});

		render(<ChatScreen />);

		expect(screen.getByText(/Item not found/i)).toBeTruthy();
	});

	it('renders the chat shell and input controls', () => {
		renderChat();

		expect(screen.getByText(/Seller Two/i)).toBeTruthy();
		expect(screen.getByText(/My Listing/i)).toBeTruthy();
		expect(screen.getByText(/Item to Match/i)).toBeTruthy();
		expect(screen.getByPlaceholderText('Enter your message.')).toBeTruthy();
	});

	it('sends a message and appends it to the conversation', async () => {
		renderChat();

		fireEvent.changeText(screen.getByPlaceholderText('Enter your message.'), 'Hello there');

		fireEvent.press(screen.getByLabelText('Send message'));

		await waitFor(() => {
			expect(addMessageForItem).toHaveBeenCalledWith(1000005, 'Hello there');
			expect(screen.getByText('Hello there')).toBeTruthy();
		});
	});

	it('navigates back to explore when the back button is pressed', () => {
		renderChat({ source: 'explore', fromExplore: 'true' });

		fireEvent.press(screen.getByLabelText('Back'));

		expect(mockReplace).toHaveBeenCalledWith('/(tabs)/explore');
	});

	it('opens the unmatch alert and removes the notification when confirmed', () => {
		renderChat();

		fireEvent.press(screen.getByLabelText('Unmatch'));

		expect(Alert.alert).toHaveBeenCalledWith(
			'Unmatch',
			'This match has been removed.',
			expect.any(Array)
		);

		const buttons = (Alert.alert as jest.Mock).mock.calls[0][2];
		const okButton = buttons.find((button: any) => button.text === 'OK');
		okButton.onPress();

		expect(mockRemoveNotification).toHaveBeenCalledWith(1, 2);
		expect(mockBack).toHaveBeenCalledTimes(1);
	});
});
