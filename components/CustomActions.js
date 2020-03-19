import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

// import { AntDesign } from '@expo/vector-icons';
// <AntDesign name='pluscircleo' color='#b2b2b2' />

export default class CustomActions extends Component {
  // User presses action button > onActionPress called > creates ActionSheet
  // ActionSheet displays set of defined actions
  // User selects action > method for performing action is called

  pickImage = async () => {
    // Code goes here
  }

  takePhoto = async () => {
    // Code
  }

  getLocation = async () => {
    // Code
  }

  uploadImage = async () => {
    // Code
  }

  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    // context class used to hand options to display to ActionSheet component
    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0: console.log('user wants to pick an image');
            return this.pickImage();
          case 1: console.log('user wants to take a photo');
            return this.takePhoto();
          case 2: console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    );
  };

  render() {
    return (

      <TouchableOpacity
        style={[styles.container]}
        onPress={this.onActionPress}>
        <View style={[styles.actionButton, this.props.actionButtonStyle]}>
          <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    height: 26,
    marginBottom: 10,
    marginLeft: 10,
    width: 26,
  },
  actionButton: {
    borderColor: '#b2b2b2',
    borderRadius: 13,
    borderWidth: 2,
    flex: 1
  },
  iconText: {
    backgroundColor: 'transparent',
    color: '#b2b2b2',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};