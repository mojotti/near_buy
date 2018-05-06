import React, { Component } from 'react';
import { View } from 'react-native';
import { styles } from '../../static/styles/ListViewItemStyle';

export default class ItemSeparator extends Component {
  render() {
    return <View style={styles.separator} />;
  }
}
