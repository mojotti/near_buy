'use strict';

import React from 'react';
import store from '../../../redux/index';
import {
  Alert,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import {
  alertInvalidValuesNewItem,
  localhost,
} from '../../static/constants';
import { styles } from '../../static/styles/NewItemStyles';
import { ItemDetails } from './ItemDetails';
import { ImageRow } from './ImageRow';

const UPPER_BUTTON_IDS = {
  leftButtonId: 0,
  rightButtonId: 1,
};

const LOWER_BUTTON_IDS = {
  leftButtonId: 2,
  rightButtonId: 3,
};

export class NewItem extends React.Component {
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
  }

  static navigationOptions = {
    title: 'Add item',
  };

  getHeaders() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append(
      'Authorization',
      `Bearer ${store.getState().authorizationReducer.token}`,
    );
    return headers;
  }

  resetNavigationAndNavigateToRoute(targetRoute) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: targetRoute })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  handleNewItemCreation() {
    const { title, price, description } = this.state;
    if (title === '' || price === '' || description === '') {
      Alert.alert(...alertInvalidValuesNewItem);
      return;
    }
    const url = `http://${localhost}:5000/api/v1.0/items`;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        price: price,
        description: description,
      }),
      headers: this.getHeaders(),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.handleResponse(responseJson);
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleResponse(responseJson) {
    if (responseJson.item && responseJson.item.title === this.state.title) {
      this.resetNavigationAndNavigateToRoute('Items');
    } else {
      Alert.alert('Item creation failed', 'Something went wrong');
    }
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
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerText}>Item details</Text>
          <ItemDetails {...itemDetailsProps} />
          <Text style={styles.headerText}>Add pictures</Text>
          <ImageRow {...firstImageRowProps} style={styles.imageRowMargin} />
          <ImageRow {...secondImageRowProps} style={styles.imageRowMargin} />
          {this.renderSubmitButton()}
        </View>
      </ScrollView>
    );
  }
}

export default NewItem;
