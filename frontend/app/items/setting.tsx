import { StyleSheet, View } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import ToggleSwitch from 'toggle-switch-react-native'
import { Component } from 'react';

export default class App extends Component<{}> {
  state = {
    isOnDefaultToggleSwitch: true,
    isOnLargeToggleSwitch: false,
    isOnBlueToggleSwitch: false
  };

  onToggle(isOn: string | boolean) {
    console.log("Matching mode changed to " + isOn);
  }

  render() {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.welcome}>Change to Matching mode</ThemedText>
        {/* <ThemedText style={styles.instructions}></ThemedText> */}
        <ToggleSwitch
          onColor='#687076'
          isOn={this.state.isOnBlueToggleSwitch}
          onToggle={isOnBlueToggleSwitch => {
            this.setState({ isOnBlueToggleSwitch });
            this.onToggle(isOnBlueToggleSwitch);
          }}
        />
      </ThemedView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    marginBottom: 5
  }
});
