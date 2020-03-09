import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
// only for android
import KeyboardSpacer from 'react-native-keyboard-spacer';




export default class Chat extends Component {

  // Creation of the state object in order to send, reseive and display messages
  state = {
    messages: [],
  }

  // Called as soon as Chat component mounts
  // Set the state with a static message to be able to see each UI element displeyed on screen
  componentDidMount() {
    this.setState({
      // Messages must follow a certain format to work with Gifted Chat library: ID, creation date, user object (user ID, name, avatar)
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        // System message: commonly used to display last time user was active or joins chat for first time
        {
          _id: 2,
          text: `${this.props.navigation.state.params.name} has entered the chat`,
          createdAt: new Date(),
          system: true,
        },

      ]
    })
  }

  // Custom function called when user sends a message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  // Change background color of sender's speech bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }


  // display user name in navigation bar 
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    };
  };

  // Code for rendering chat interface with GiftedChat component
  // ----- !!!
  // Don't forget to add accesibilityLabel and accessibilityHint for screenreacers to action button in input field 
  /// ----- !!!
  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.bgColor }]}>
        <GiftedChat
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {/* Make sure that keyboard and message input field display correctly in Android OS */}
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  }
});