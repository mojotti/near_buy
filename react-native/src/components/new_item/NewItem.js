'use strict';

import React from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import RNFetchBlob from 'react-native-fetch-blob';

import { alertInvalidValuesNewItem, localhost } from '../../static/constants';
import { styles } from '../../static/styles/NewItemStyles';
import { ItemDetails } from './ItemDetails';
import { ImageRow } from './ImageRow';
import { getFormDataHeaders } from '../../networking/networking';
import { baseStyles } from '../../static/styles/BaseStyles';


const UPPER_BUTTON_IDS = {
  leftButtonId: 0,
  rightButtonId: 1,
};

const LOWER_BUTTON_IDS = {
  leftButtonId: 2,
  rightButtonId: 3,
};

export class _NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      price: '',
      description: '',
      images: [null, null, null, null],
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.setNewImage = this.setNewImage.bind(this);
    this.getNewItemData = this.getNewItemData.bind(this);
    this.isValidItem = this.isValidItem.bind(this);

    this.isButtonDisabled = false;
  }

  static navigationOptions = {
    title: 'Add item',
  };

  resetNavigationAndNavigateToRoute(targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: targetRoute })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  getImages() {
    let images = [];
    let i = 0;
    this.state.images.forEach(image => {
      if (image) {
        images.push({
          name: 'pictures[]',
          filename: 'image' + i + '.jpg',
          type: image.mime,
          data: RNFetchBlob.wrap(image.path),
        });
        i++;
      }
    });
    return images;
  }

  getNewItemData() {
    const images = this.getImages();
    return [
      ...images,
      {
        name: 'info',
        data: JSON.stringify({
          longitude: this.props.longitude,
          latitude: this.props.latitude,
          title: this.state.title,
          price: this.state.price,
          description: this.state.description,
        }),
      },
    ];
  }

  isValidItem() {
    const { title, price, description } = this.state;
    if (title === '' || price === '' || description === '') {
      Alert.alert(...alertInvalidValuesNewItem);
      return false;
    }
    return true;
  }

  handleNewItemCreation() {
    if (!this.isValidItem() || this.isButtonDisabled) {
      return;
    }
    this.isButtonDisabled = true;
    const url = `http://${localhost}:5000/api/v1.0/items`;
    RNFetchBlob.fetch(
      'POST',
      url,
      getFormDataHeaders(this.props.token),
      this.getNewItemData()
    )
      .then(response => response.json())
      .then(responseJson => this.handleResponse(responseJson))
      .catch(error => {
        console.error(error);
        this.isButtonDisabled = false;
      });
  }

  handleResponse(responseJson) {
    if (responseJson.item && responseJson.item.title === this.state.title) {
      this.resetNavigationAndNavigateToRoute('UserItems');
    } else {
      Alert.alert('Item creation failed', 'Something went wrong');
    }
    this.isButtonDisabled = false;
  }

  renderSubmitButton() {
    return (
      <TouchableHighlight
        id="SubmitButton"
        onPress={() => this.handleNewItemCreation()}
        style={styles.submitButton}
      >
        <Text style={styles.submitText}>{'Submit item'}</Text>
      </TouchableHighlight>
    );
  }

  setNewImage(image, id) {
    this.setState(prevState => {
      let images = prevState.images;
      images[id] = image;
      return images;
    });
  }

  handleTitleChange(text) {
    this.setState({ title: text });
  }

  handleDescriptionChange(text) {
    this.setState({ description: text });
  }

  handlePriceChange(text) {
    this.setState({ price: text });
  }

  render() {
    const itemDetailsProps = {
      onTitleChange: this.handleTitleChange,
      onDescriptionChange: this.handleDescriptionChange,
      onPriceChange: this.handlePriceChange,
    };

    const firstImageRowProps = {
      onImageSelected: this.setNewImage,
      ...UPPER_BUTTON_IDS,
      images: this.state.images.slice(0, 2),
    };

    const secondImageRowProps = {
      onImageSelected: this.setNewImage,
      ...LOWER_BUTTON_IDS,
      images: this.state.images.slice(2),
    };

    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={baseStyles.headerText}>Item details</Text>
          <ItemDetails {...itemDetailsProps} />
          <Text style={baseStyles.headerText}>Add pictures</Text>
          <ImageRow {...firstImageRowProps} style={styles.imageRowMargin} />
          <ImageRow {...secondImageRowProps} style={styles.imageRowMargin} />
          {this.renderSubmitButton()}
        </View>
      </ScrollView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { latitude, longitude } = state.locationReducer;
  const token = state.authorizationReducer.token;
  return { latitude, longitude, token };
};

const NewItem = connect(mapStateToProps, null)(_NewItem);
export default NewItem;
