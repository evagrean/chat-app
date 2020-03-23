import React, { Component } from 'react';
import { AsyncStorage, Keyboard, StyleSheet, TouchableWithoutFeedback, View, YellowBox } from 'react-native';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';
import { decode, encode } from 'base-64'
// only for android
import KeyboardSpacer from 'react-native-keyboard-spacer';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';
// require Firebase and Cloud Firestore
const firebase = require('firebase');
require('firebase/firestore');

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}


export default class Chat extends Component {

  constructor(props) {
    super(props);

    YellowBox.ignoreWarnings(['Setting a timer']);


    // Creation of the state object in order to send, receive and display messages
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
    };

    // Initialize Firebase and connect to Firestore database
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDmXKwGCCOpKFmOQFirJuya5Vli4Z-RK0w",
        authDomain: "chat-app-66e5f.firebaseapp.com",
        databaseURL: "https://chat-app-66e5f.firebaseio.com",
        projectId: "chat-app-66e5f",
        storageBucket: "chat-app-66e5f.appspot.com",
        messagingSenderId: "1033550813300",
        appId: "1:1033550813300:web:5080f50f0684c29e1cd921"
      });
    }

    this.referenceChatAppUser = null;

    // Create reference to Firestore 'messages' collection which stores and retreives messages the users send
    this.referenceMessages = firebase.firestore().collection('messages');
  }

  // display user-name in navigation bar 
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name,
    };
  };

  // This function is fired when 'messages' collection changes. 
  // Needs to retreive current data in 'messages' collection and store it in state 'messages', allowing that data to be rendered in view
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
        image: data.image || '',
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };


  // Add new messages to the database
  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      uid: this.state.uid,
      image: message.image || '',
      location: message.location || null,
    });
  }

  // Custom function called when user sends a message
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
      this.saveMessages();
    });
  }

  // Async functions 
  async getMessages() {
    let messages = '';
    // wrap logic in try and catch so that errors can be caught
    try {
      // await used to wait until asyncStorage promise settles
      // Read messages in storage with getItem method (takes a key)
      messages = await AsyncStorage.getItem('messages') || [];
      // Give messages variable the saved data via setState
      this.setState({
        // Use JSON.parse to convert saved string back into an object
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }

  // hide Input field when offline because messages can't be sent
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props} />
      );
    }
  };

  // Change background color of sender's speech bubble
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#454a52',
          }
        }}
        textStyle={{
          right: {
            color: '#fff',
          }
        }}
      />
    )
  }


  // Check if current message contains location data, if yes, return a MapView
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ borderRadius: 13, height: 100, margin: 3, width: 150, }}
          region={{
            latitude: Number(currentMessage.location.latitude),
            longitude: Number(currentMessage.location.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  // This function is responsible for creating the circle button. 
  //Newly created component for custom actions works with props that this function recieves
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  }

  // Called as soon as Chat component mounts
  componentDidMount() {
    // Check connection status once
    NetInfo.fetch().then(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });

    // Subscribe to updates about the network state (allows to perform actions) anytime network state changes)
    NetInfo.addEventListener(state => {
      const isConnected = state.isConnected;
      if (isConnected == true) {
        this.setState({
          isConnected: true,
        });
      } else {
        this.setState({
          isConnected: false,
        });
      }
    });

    NetInfo.fetch().then(state => {
      const isConnected = state.isConnected;
      if (isConnected == true) {
        this.setState({
          isConnected: true,
        });
        // Listen to authentication events
        // onAuthStateChanged() function called when user's sign-in state changes, returns unsubscribe() function, provides you with user object
        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          // update user state with currently active user data
          this.setState({
            uid: user.uid,
            messages: [],
          });

          // Create a reference to active user's documents (messages). User can see all messages
          this.referenceChatAppUser = firebase.firestore().collection('messages').orderBy('createdAt', 'desc')

          // Listen for collection changes for current user
          this.unsubscribeChatAppUser = this.referenceChatAppUser.onSnapshot(this.onCollectionUpdate);
        });
      } else {
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    // Stop listening to authentication
    this.authUnsubscribe();

    // Stop listening for changes
    this.unsubscribeChatAppUser();
  }

  // Code for rendering chat interface with GiftedChat component
  // ----- !!!
  // Don't forget to add accesibilityLabel and accessibilityHint for screenreacers to action button in input field 
  /// ----- !!!
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
        <View style={[styles.container, { backgroundColor: this.props.navigation.state.params.bgColor }]}>
          <GiftedChat
            renderBubble={this.renderBubble}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderActions={this.renderCustomActions}
            renderCustomView={this.renderCustomView} // prop used to render the map in a custom view
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: this.state.uid,
              avatar: "https://placeimg.com/140/140/any",
              name: this.props.navigation.state.params.name,
            }}
            renderUsernameOnMessage={true}
          />
          {/* Make sure that keyboard and message input field display correctly in Android OS */}
          {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
        </View>
      </TouchableWithoutFeedback>
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
