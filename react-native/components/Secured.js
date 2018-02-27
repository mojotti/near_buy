import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Items from './Items.js';
import NewItem from './NewItem';

const App = StackNavigator(
  {
    Items: { screen: Items },
    NewItem: { screen: NewItem },
  },
  {
    cardStyle: {
      paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
    },
  },
);

class Secured extends Component {
  render() {
    return <App />;
  }
}

export default Secured;
