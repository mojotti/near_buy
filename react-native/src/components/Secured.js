import React, { Component } from 'react';
import { AppState, Dimensions } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import UserItems from './user_items/UserItems';
import NewItem from './new_item/NewItem';
import UserItemDetails from './user_items/UserItemDetails';
import ItemExplorer from './item_explorer/ItemExplorer';
import { handleAppStateChange } from '../AppState';
import { runAppStartEvents } from '../AppStartEvents';
import { baseFont } from '../static/styles/BaseStyles';
import DrawerMenu from './drawer/DrawerMenu';
import ItemDetails from './item_explorer/ItemDetails';
import ItemCard from './item_explorer/ItemCard';
import MyChats from './chats/MyChats';
import Chat from './chats/Chat';

const App = StackNavigator(
  {
    ItemExplorer: { screen: ItemExplorer },
    UserItems: { screen: UserItems },
    UserItemDetails: { screen: UserItemDetails },
    MyChats: { screen: MyChats },
    ItemCard: { screen: ItemCard },
    Chat: { screen: Chat },
    NewItem: {
      screen: NewItem,
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
    },
    ItemDetails: {
      screen: ItemDetails,
      navigationOptions: () => ({ drawerLockMode: 'locked-closed' }),
    },
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
    drawerWidth: Dimensions.get('window').width * 0.6,
  },
);

class Secured extends Component {
  componentDidMount() {
    runAppStartEvents(this.props.dispatch, this.props.token);
    AppState.addEventListener('change', handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', handleAppStateChange);
  }

  render() {
    return <Drawer />;
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.authorizationReducer.token,
  };
};

Secured.propTypes = {
  dispatch: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, null)(Secured);
