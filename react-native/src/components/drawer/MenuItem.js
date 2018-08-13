import React, { Component } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../../static/styles/DrawerStyles';
import { navigateToItem } from '../../redux/actions/NavigationAction';

export class _MenuItem extends Component {
  _navigate(route) {
    return this.props.navigation.dispatch(
      NavigationActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: `${route}` })],
      }));
  }

  _handleNavigation = () => {
    this._navigate(this.props.navigationRoute, {
      isStatusBarHidden: false,
    });
    this.props.dispatch(navigateToItem(this.props.itemName));
  };

  _getBackgroundColor = () => {
    if (this.props.itemName === this.props.currentTab) {
      return { backgroundColor: '#eaebff' };
    }
    return { backgroundColor: '#FFFFFF' };
  };

  render() {
    return (
      <View style={this._getBackgroundColor()}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={this._handleNavigation}
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

_MenuItem.propTypes = {
  itemName: PropTypes.string.isRequired,
  iconName: PropTypes.string.isRequired,
  iconSize: PropTypes.number.isRequired,
  navigationRoute: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
  }).isRequired,
  currentTab: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    currentTab: state.navigationReducer.currentTab,
  };
};

const MenuItem = connect(mapStateToProps)(_MenuItem);
export default MenuItem;
