import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { logout } from '../../redux/actions/AuthorizationAction';
import { styles } from '../../static/styles/DrawerStyles';
import MenuItem from './MenuItem';

class DrawerMenu extends Component {
  render() {
    const allItemsProps = {
      itemName: 'All items',
      iconName: 'public',
      iconSize: 27,
      navigationRoute: 'ItemExplorer',
      navigation: this.props.navigation,
    };
    const myItemProps = {
      itemName: 'My items',
      iconName: 'account-circle',
      iconSize: 27,
      navigationRoute: 'UserItems',
      navigation: this.props.navigation,
    };
    const myChatProps = {
      itemName: 'Chats',
      iconName: 'comment',
      iconSize: 27,
      navigationRoute: 'MyChats',
      navigation: this.props.navigation,
    };

    return (
      <View style={styles.container}>
        <View>
          <MenuItem {...allItemsProps} />
          <MenuItem {...myItemProps} />
          <MenuItem {...myChatProps} />
        </View>

        <TouchableHighlight
          onPress={() => this.props.onLogout()}
          style={styles.logoutButton}
        >
          <Text style={styles.loginText}>Logout</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => {
      dispatch(logout());
    },
  };
};

DrawerMenu.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(DrawerMenu);
