import React, { Component } from 'react';
import { Alert, Dimensions, TouchableHighlight, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import PropTypes from 'prop-types';
import RNFetchBlob from 'react-native-fetch-blob';
import { getFormDataHeaders } from '../../networking/networking';
import { localhost } from '../../static/constants';
import { connect } from 'react-redux';
import ImagePlaceholder from '../image_placeholder/ImagePlaceholder';
const { height, width } = Dimensions.get('window');

export class _DetailImage extends Component {
  constructor(props) {
    super(props);
    this.handleImageSelection = this.handleImageSelection.bind(this);
    this.handleNewImage = this.handleNewImage.bind(this);
  }

  renderImage = () => {
    return (
      <View style={{ flex: 1 }}>
        <ImagePlaceholder
          url={this.props.url}
          styles={{ width, height: width, paddingTop: 20 }}
          placeholderSize={width * 0.8}
        />
      </View>
    );
  };

  sendItemToDb = image => {
    let images = [];
    images.push({
      name: 'pictures[]',
      filename: 'image' + this.props.numOfPics + '.jpg',
      type: image.mime,
      data: RNFetchBlob.wrap(image.path),
    });

    const url = `http://${localhost}:5000/api/v1.0/items/${
      this.props.id
    }/add_picture`;
    RNFetchBlob.fetch('POST', url, getFormDataHeaders(this.props.token), images)
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.ok) {
          this.props.onImageUpload();
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  handleNewImage = () => {
    ImagePicker.openCamera({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then(image => this.sendItemToDb(image))
      .catch(error => console.log('error in image selection:', error));
  };

  handleGalleryImage = () => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    })
      .then(image => this.sendItemToDb(image))
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
      { cancelable: false }
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
          height: width,
          width: width,
        }}
      >
        <TouchableHighlight
          onPress={this.handleImageSelection}
          underlayColor={'#888888'}
        >
          <MaterialIcons name="add-a-photo" size={height * 0.4} color="gray" />
        </TouchableHighlight>
      </View>
    );
  };

  render() {
    return this.props.url ? this.renderImage() : this.renderPlaceholder();
  }
}

_DetailImage.propTypes = {
  url: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
  onImageUpload: PropTypes.func.isRequired,
  numOfPics: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const token = state.authorizationReducer.token;
  return { token };
};

const DetailImage = connect(mapStateToProps, null)(_DetailImage);
export default DetailImage;
