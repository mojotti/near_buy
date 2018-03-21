import React, { Component } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { logout } from '../../redux/actions/AuthorizationAction';

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
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            this._navigate('UserItems', { isStatusBarHidden: false })
          }
        >
          <Text style={styles.menuItemText}>My Items</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            this._navigate('ItemExplorer', { isStatusBarHidden: false })
          }
        >
          <Text style={styles.menuItemText}>All Items</Text>
        </TouchableOpacity>
        <Button
          onPress={() => this.props.onLogout()}
          title="Logout"
          style={{ margin: 15 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  menuItem: {
    padding: 10,
    justifyContent: 'center',
    backgroundColor: 'rgba(12, 12, 12, 0.2)',
    marginBottom: 2,
  },
  menuItemText: {
    fontSize: 20,
  },
});

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => {
      dispatch(logout());
    },
  };
};

export default connect(null, mapDispatchToProps)(DrawerMenu);
