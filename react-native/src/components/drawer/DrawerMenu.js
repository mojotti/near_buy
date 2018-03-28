import React, { Component } from 'react';
import { Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { logout } from '../../redux/actions/AuthorizationAction';
import { styles } from '../../static/styles/DrawerStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';

class DrawerMenu extends Component {
  _navigate(route) {
    return this.props.navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: `${route}` })],
      }),
    );
  }
  render() {
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              this._navigate('UserItems', { isStatusBarHidden: false })
            }
          >
            <Icon
              name="account-circle"
              size={27}
              color="#232c44"
              style={styles.iconStyles}
            />
            <Text style={styles.menuItemText}>My items</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              this._navigate('ItemExplorer', { isStatusBarHidden: false })
            }
          >
            <Icon
              name="public"
              size={27}
              color="#232c44"
              style={styles.iconStyles}
            />
            <Text style={styles.menuItemText}>All items</Text>
          </TouchableOpacity>
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

export default connect(null, mapDispatchToProps)(DrawerMenu);
