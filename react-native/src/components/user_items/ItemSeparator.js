import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '../../static/styles/ListViewItemStyle';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default class ItemSeparator extends Component {
  render() {
    return (
      <View
        style={
          [
            styles.separator,
            { width: SCREEN_WIDTH * this.props.widthPercentage },
          ]
        }
      />);
  }
}

ItemSeparator.propTypes = {
  widthPercentage: PropTypes.number.isRequired,
};
