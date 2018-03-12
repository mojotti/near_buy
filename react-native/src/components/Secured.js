import React, { Component } from 'react';
import { AppState } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

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
    runAppStartEvents(this.props.dispatch);
    AppState.addEventListener('change', handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', handleAppStateChange);
  }

  render() {
    return <App />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

Secured.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, null)(Secured);
