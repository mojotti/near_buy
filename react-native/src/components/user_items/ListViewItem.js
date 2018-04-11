import React from 'react';
import { Image, Text, View } from 'react-native';
import { styles } from '../../static/styles/ListViewItemStyle';
import { localhost } from '../../static/constants';

export class ListViewItem extends React.Component {
  render() {
    const imagePath = `http://${localhost}:5000/${
      this.props.itemId
    }/image0.jpg`;

    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: imagePath,
          }}
        />
        <View style={[styles.item, styles.separator]}>
          <Text>{`Title: ${this.props.item.title}`}</Text>
          <Text>{`Description: ${this.props.item.description}`}</Text>
          <Text>{`Price: ${this.props.item.price} €`}</Text>
        </View>
      </View>
    );
  }
}
