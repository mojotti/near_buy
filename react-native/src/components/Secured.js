import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Items from './items/Items.js';
import NewItem from './new_item/NewItem';

const App = StackNavigator({
  Items: { screen: Items },
  NewItem: { screen: NewItem },
});

class Secured extends Component {
  render() {
    return <App />;
  }
}

export default Secured;
