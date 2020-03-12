import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import Start from './components/Start';
import Chat from './components/Chat';




// Create navigator
const navigator = createStackNavigator({
  // Tell which screens I want to add navigation to
  Start: { screen: Start },
  Chat: { screen: Chat }
});

// Create main container to render: navigatorContainer
// Manages app state and links the navigation to app environment
const navigatorContainer = createAppContainer(navigator);

// Export it as the root component
export default navigatorContainer;