import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
const firebase = require('firebase');

export default class CustomActions extends Component {
  constructor() {
    super()
  }
  // Defines an array of strings to be displayed in the ActionSheet as well as an Cancel button for which need to determine its position
  onActionPress = () => {
    const options = ['Choose Picture From Library', 'Take Picture', 'Send Location', 'Cancel'];
    // defines positon of cancel button at the end of ActionSheet
    const cancelButtonIndex = options.length - 1;
    this.context.actionSheet().showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0: console.log('user wants to pick an image');
            return this.pickImage();
          case 1: console.log('user wants to take a picture');
            return this.takePhoto();
          case 2: console.log('user wants to get their location');
            return this.getLocation();
          default:
        }
      },
    );
  };


  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    if (status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  }

  takePhoto = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);

    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images'
      }).catch(error => console.log(error));

      if (!result.cancelled) {
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl });
      }
    }
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});
      const longitude = JSON.stringify(result.coords.longitude);
      const latitude = JSON.stringify(result.coords.latitude);

      if (result) {
        console.log(longitude);
        this.props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude,
          }
        })
      }
    }
  }

  // Upload image to Firebase in order to store it in database to make it visible in chat
  uploadImage = async (uri) => {

    // Before upload, need to convert file into a blob
    const blob = await new Promise((resolve, reject) => {
      // Create new XMLHttpRequest
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      // Set responseType to 'blob
      xhr.responseType = 'blob';
      // Open connection and retrieve URI's data (=image)
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    // Create unique file names for each image depending on uri
    let uriSections = uri.split('/');
    let imageName = uriSections[uriSections.length - 1];

    // Create reference to the storage and use put to store content retrieved form request
    const ref = firebase.storage().ref().child(`${imageName}`);
    const snapshot = await ref.put(blob);

    // Close connection
    blob.close();

    // Retrieve image's URL from the server
    return await snapshot.ref.getDownloadURL();
  }

  render() {
    return (

      <TouchableOpacity
        style={[styles.container]}
        // When user presses button, onActionPress is called, which creates an ActionSheet that displays set of actions
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

// GiftedChat expects actionSheet to be a function
CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};












//---------------------------------------------------------------------------------------------------------------------
// HERE COMES ORIGINAL CODE
//
//------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------



/* import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const firebase = require('firebase');

export default class CustomActions extends Component {
  constructor() {
    super()
  }

  pickImage = async () => {
    // use try{}catch{} block for AsyncStorage for proper error handling
    try {
      // Ask user for permission with permission type CAMERA_ROLL
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      // If user grants access, function returns string 'granted'
      if (status === 'granted') {
        // call launchImageLibraryAsync from ImagePicker API to open up media library of device.
        // If not cancelled, returns: cancelled: false, uri, width, height, type
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: 'Images',
        }).catch(error => console.log(error));

        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl })
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  takePhoto = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'Images',
        }).catch(error => console.log(error));
        if (!result.cancelled) {
          const imageUrl = await this.uploadImage(result.uri);
          this.props.onSend({ image: imageUrl })
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // getLocation = async () => {

  //   const { status } = await Permissions.askAsync(Permissions.LOCATION);

  //   if (status === 'granted') {
  //     let result = await Location.getCurrentPositionAsync({}).catch(error => console.log(error));
  //     const longitude = JSON.stringify(result.coords.longitude);
  //     const latitude = JSON.stringify(result.coords.latitude);
  //     if (result) {
  //       this.props.onSend({
  //         location: {
  //           longitude,
  //           latitude
  //         }
  //       })
  //     }
  //   }
  // }
  // Storing the images in Google Firebase Storage
  uploadImage = async (uri) => {
    try {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = ((e) => {
          console.log(e);
          reject(new TypeError('Network Request Failed'));
        });
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
      // Make unique name for each image uploaded
      const getImageNameFromUri = uri.split('/');
      let imageName = getImageNameFromUri[getImageNameFromUri.length - 1];
      const ref = firebase.storage().ref().child(`${imageName}`);
      const snapshot = await ref.put(blob);

      blob.close();

      const imageUrl = await snapshot.ref.getDownloadURL();
      return imageUrl;

    } catch (error) {
      console.log(error.message);
    }

  }

  // User presses action button > onActionPress called > creates ActionSheet
  // ActionSheet displays set of defined actions
  // User selects action > method for performing action is called
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
            // return this.pickImage();
          case 1: console.log('user wants to take a photo');
            // return this.takePhoto();
          case 2: console.log('user wants to get their location');
          // return this.getLocation();
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
}; */