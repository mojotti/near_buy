'use strict';

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import Application from './components/Application';
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
