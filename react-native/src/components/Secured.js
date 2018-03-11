import React, { Component } from 'react';
import { AppState } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Items from './items/Items';
import NewItem from './new_item/NewItem';
import { handleAppStateChange } from '../AppState';
import { runAppStartEvents } from '../AppStartEvents';

const App = StackNavigator({
  Items: { screen: Items },
  NewItem: { screen: NewItem },
});

class Secured extends Component {
  componentDidMount() {
    runAppStartEvents();
    AppState.addEventListener('change', handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', handleAppStateChange);
  }

  render() {
    return <App />;
  }
}

export default Secured;
