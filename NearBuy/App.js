'use strict';

import React, { Component } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import Application from './pages/Application';
import store from './redux';

export default class App extends Component {
  render() {
      return (
        <Provider store={store}>
          <Application />
        </Provider>
      );
    }
}
