import React, { Component } from 'react';
import { Alert, Dimensions, TouchableHighlight, View } from 'react-native';
import ImageLoad from 'react-native-image-placeholder';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
const { height } = Dimensions.get('window');

export default class DetailImage extends Component {
  constructor(props) {
    super(props);
    this.handleImageSelection = this.handleImageSelection.bind(this);
    this.handleNewImage = this.handleNewImage.bind(this);
  }

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

  handleNewImage = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then(image => console.log(image))
      .catch(error => console.log('error in image selection:', error));
  };

  handleGalleryImage = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then(image => console.log(image))
      .catch(error => console.log('error in image selection:', error));
  };

  handleImageSelection() {
    Alert.alert(
      'Select picture',
      'Select from gallery or take a new one with camera',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Gallery',
          onPress: () => this.handleGalleryImage(),
        },
        { text: 'Camera', onPress: () => this.handleNewImage() },
      ],
      { cancelable: false },
    );
  }

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
        <TouchableHighlight onPress={this.handleImageSelection}>
          <MaterialIcons name="add-a-photo" size={height * 0.4} color="gray" />
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    return this.props.url ? this.renderImage() : this.renderPlaceholder();
  }
}
