import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const { height } = Dimensions.get('window');

export default class DetailImage extends Component {
  renderImage = () => {
    return (
      <View style={{ flex: 1 }}>
        <ImageLoad
          style={{ flex: 1 }}
          placeholderStyle={{
            flex: 1,
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          source={{ uri: this.props.url }}
          isShowActivity={false}
        />
      </View>
    );
  };

  renderPlaceholder = () => {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: 40,
          backgroundColor: '#FFFFFF',
        }}
      >
        <MaterialIcons name="add-a-photo" size={height * 0.4} color="gray" />
      </View>
    );
  };

  render() {
    return this.props.url ? this.renderImage() : this.renderPlaceholder();
  }
}
