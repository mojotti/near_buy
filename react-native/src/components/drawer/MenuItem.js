import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../static/styles/DrawerStyles';

class MenuItem extends Component {
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
      <View>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() =>
            this._navigate(this.props.navigationRoute, {
              isStatusBarHidden: false,
            })
          }
        >
          <Icon
            name={this.props.iconName}
            size={this.props.iconSize}
            color="#232c44"
            style={styles.iconStyles}
          />
          <Text style={styles.menuItemText}>{this.props.itemName}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

MenuItem.propTypes = {
  itemName: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired,
  navigationRoute: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(null, null)(MenuItem);
