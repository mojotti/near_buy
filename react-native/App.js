'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import Application from './src/components/Application';
import store from './src/redux/ReduxStore';

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Application />
      </Provider>
    );
  }
}
