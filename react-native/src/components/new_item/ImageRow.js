import React from 'react';
import { Alert, Image, TouchableHighlight, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-crop-picker';
import { cameraIconSize, styles } from '../../static/styles/NewItemStyles';

export class ImageRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleImageSelection = this.handleImageSelection.bind(this);
    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleGalleryImage = this.handleGalleryImage.bind(this);
    this.renderEmptyImageButton = this.renderEmptyImageButton.bind(this);
    this.renderImageButton = this.renderImageButton.bind(this);
  }

  handleImageSelection(imageId) {
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
          onPress: () => this.handleGalleryImage(imageId),
        },
        { text: 'Camera', onPress: () => this.handleNewImage(imageId) },
      ],
      { cancelable: false },
    );
  }

  handleNewImage(imageId) {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then(image => this.props.onImageSelected(image, imageId))
      .catch(error => console.log('error in image selection:', error));
  }

  handleGalleryImage(imageId) {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then(image => this.props.onImageSelected(image, imageId))
      .catch(error => console.log('error in image selection:', error));
  }

  renderEmptyImageButton(buttonId) {
    return (
      <MaterialIcons.Button
        name={'add-a-photo'}
        backgroundColor={'transparent'}
        size={cameraIconSize}
        color={'gray'}
        style={styles.addPhotoButton}
        onPress={() => this.handleImageSelection(buttonId)}
      />
    );
  }

  renderImageButton(buttonId) {
    const index = buttonId % 2 === 0 ? 0 : 1;
    return (
      <TouchableHighlight onPress={() => this.handleImageSelection(buttonId)}>
        <Image
          style={styles.photoStyles}
          source={{ uri: this.props.images[index].path }}
        />
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View style={styles.imageRow}>
        {this.props.images[0] === null
          ? this.renderEmptyImageButton(this.props.leftButtonId)
          : this.renderImageButton(this.props.leftButtonId)}

        {this.props.images[1] === null
          ? this.renderEmptyImageButton(this.props.rightButtonId)
          : this.renderImageButton(this.props.rightButtonId)}
      </View>
    );
  }
}

ImageRow.propTypes = {
  onImageSelected: PropTypes.func.isRequired,
  leftButtonId: PropTypes.number.isRequired,
  rightButtonId: PropTypes.number.isRequired,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      size: PropTypes.number,
      mime: PropTypes.string,
      height: PropTypes.number,
      width: PropTypes.number,
      modificationDate: PropTypes.string,
      path: PropTypes.string,
      cropRect: PropTypes.shape({
        height: PropTypes.number,
        width: PropTypes.number,
        y: PropTypes.number,
        x: PropTypes.number,
      }),
    }),
  ).isRequired,
};
