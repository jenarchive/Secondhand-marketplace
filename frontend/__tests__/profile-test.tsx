import { render, fireEvent, userEvent } from '@testing-library/react-native';
import HomeScreen from '../app/(tabs)/profile'; 
import LoginScreen from '@/app/items/review';


describe('profile page Integration Test', () => {
    it('should go to different page when profile card is pressed', () => {
        // render the page and get element to press
        // render(<HomeScreen />);

        // Simulate press
        // fireEvent.press(screen.getByText('Press me'), eventData);

        // const { getByText } = render(<HomeScreen />)

        // After button press, check if review page is out
        // expect(onPressMock).toHaveBeenCalledWith(eventData);
  });
});