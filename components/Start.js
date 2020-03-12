import React, { Component } from 'react';
import { ImageBackground, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

// This is the start screen
export default class Start extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      bgColor: ''
    }
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); }}>
        <ImageBackground source={require('../assets/bg-img.png')} style={styles.bgImage}>
          <Text style={styles.title}>Chat App</Text>
          <View style={styles.container}>
            <View style={styles.nameContainer}>
              <AntDesign name='user' size={20} color='gray' />
              <TextInput
                style={styles.nameInput}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder='Your Name'
              />
            </View>
            <Text style={styles.bgColorText}>Choose Background Color:</Text>
            <View style={styles.colorButtonContainer}>
              {/* black */}
              <TouchableOpacity
                onPress={() => this.setState({ bgColor: '#090C08' })}
                style={[styles.colorButton, styles.color1]} />
              {/* purple */}
              <TouchableOpacity
                onPress={() => this.setState({ bgColor: '#474056' })}
                style={[styles.colorButton, styles.color2]}
              />
              {/* greyblue */}
              <TouchableOpacity
                onPress={() => this.setState({ bgColor: '#8A95A5' })}
                style={[styles.colorButton, styles.color3]}
              />
              {/* green */}
              <TouchableOpacity
                onPress={() => this.setState({ bgColor: '#B9C6AE' })}
                style={[styles.colorButton, styles.color4]}
              />
            </View>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, bgColor: this.state.bgColor })}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Start Chatting</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ImageBackground >
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  bgImage: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-between',
    width: '100%',
  },
  bgColorText: {
    color: '#747083',
    fontSize: 16,
    fontWeight: '300',
    width: '88%',
  },
  button: {
    backgroundColor: '#757083',
    padding: 10
  },
  buttonContainer: {
    height: 45,
    width: '88%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  colorButton: {
    borderRadius: 50 / 2,
    height: 50,
    marginRight: 18,
    width: 50,
  },
  colorButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '88%',
  },
  color1: {
    backgroundColor: '#090C08',
  },
  color2: {
    backgroundColor: '#474056',
  },
  color3: {
    backgroundColor: '#8A95A5',
  },
  color4: {
    backgroundColor: '#B9C6AE',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    height: '44%',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '88%',
  },
  nameContainer: {
    alignItems: 'center',
    color: '#757083',
    borderColor: 'gray',
    borderWidth: 1,
    flexDirection: 'row',
    fontSize: 16,
    fontWeight: '300',
    height: 45,
    opacity: 0.5,
    paddingLeft: 10,
    width: '88%',
  },
  nameInput: {
    marginLeft: 10,
  },
  title: {
    alignItems: 'center',
    color: '#FFFFFF',
    flex: 1,
    fontSize: 45,
    fontWeight: '600',
    marginTop: 75,
  },
});