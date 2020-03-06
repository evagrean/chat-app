import React, { Component } from 'react';
import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
      <ImageBackground source={require('../assets/bg-img.png')} style={styles.bgImage}>
        <Text style={styles.title}>Chat App</Text>
        <View style={styles.container}>
          <TextInput
            style={styles.nameBox}
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            placeholder='Your Name'
          />
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
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              title='Start Chatting'
              color='#757083'
              onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, bgColor: this.state.bgColor })}
            />

          </View>
        </View>
      </ImageBackground >
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
    color: '#FFFFFF',
    backgroundColor: '#757083',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '88%',
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
  nameBox: {
    color: '#757083',
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 16,
    fontWeight: '300',
    height: 40,
    opacity: 0.5,
    paddingLeft: 10,
    width: '88%',
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