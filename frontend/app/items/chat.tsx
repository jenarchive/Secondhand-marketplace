import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";

export default class App extends React.Component {
  state = {
    messages: [
      {
        _id: 1,
        text: "Hello, this is user 1",
        createdAt: new Date(),
        user: {
        _id: 2, 
        name: "React Native User",
        avatar: "https://www.pngegg.com/en/search?q=avatar",
      },
      }
    ]
  };
  
render() {
    return (
      <View style={styles.container}>
        <GiftedChat messages={this.state.messages} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
  }
});