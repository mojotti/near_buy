import React, { Component } from 'react';
import { AppState, Dimensions } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserItems from './user_items/UserItems';
import NewItem from './new_item/NewItem';
import ItemExplorer from './item_explorer/ItemExplorer';
import { handleAppStateChange } from '../AppState';
import { runAppStartEvents } from '../AppStartEvents';
import { baseFont } from '../static/styles/baseStyles';
import DrawerMenu from './drawer/DrawerMenu';

const App = StackNavigator(
  {
    ItemExplorer: { screen: ItemExplorer },
    UserItems: { screen: UserItems },
    NewItem: { screen: NewItem },
  },
  {
    navigationOptions: {
      headerTitleStyle: {
        fontFamily: baseFont,
      },
    },
  },
);

const Drawer = DrawerNavigator(
  {
    Main: { screen: App },
  },
  {
    contentComponent: DrawerMenu,
    drawerWidth: Dimensions.get('window').width * 0.5,
  },
);

class Secured extends Component {
  componentDidMount() {
    runAppStartEvents(this.props.dispatch);
    AppState.addEventListener('change', handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', handleAppStateChange);
  }

  render() {
    return <Drawer />;
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

Secured.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, null)(Secured);
