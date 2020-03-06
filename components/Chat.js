import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';




export default class Chat extends Component {

  // display user name in navigation bar 
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    };
  };

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.bgColor }]}>
        <Text style={{ color: '#FFFFFF' }}>This is the chat screen with the choosen background color</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  }
});