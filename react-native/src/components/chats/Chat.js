import React from 'react';
import { View } from 'react-native';


export default class Chat extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return { title: navigation.state.params.item.title };
  };

  render() {
    console.log('thos', this.props);
    return (
      <View />
    );
  }
}
