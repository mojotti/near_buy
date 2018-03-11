import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../static/styles/ListViewItemStyle';

export class ListViewItem extends React.Component {
  render() {
    return (
      <View style={[styles.item, styles.separator]}>
        <Text>{`Title: ${this.props.item.title}`}</Text>
        <Text>{`Description: ${this.props.item.description}`}</Text>
        <Text>{`Price: ${this.props.item.price} €`}</Text>
      </View>
    );
  }
}
