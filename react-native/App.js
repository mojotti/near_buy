'use strict';

import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Application from './src/components/Application';
import { store, persistor } from './src/redux/ReduxStore';
import LoadingAnimation from './src/components/common/LoadingAnimation';

export default class App extends React.Component {
  _renderLoader = () => {
    return <LoadingAnimation animation="dino" />;
  };

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={this._renderLoader()} persistor={persistor}>
          <Application />
        </PersistGate>
      </Provider>
    );
  }
}
