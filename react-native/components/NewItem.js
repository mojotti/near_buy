import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

class NewItem extends Component {
  static navigationOptions = {
    title: 'Sell item',
  };

  render() {
    return (
      <View>
        <Text>
          {"New item"}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
 actionButtonIcon: {
 },
});

export default NewItem;
