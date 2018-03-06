'use strict';

import React from 'react';
import store from '../../redux/index';
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
} from '../../src/static/constants';
import { styles } from '../../src/static/styles/NewItemStyles';
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
      mounted: false,
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

  componentDidMount() {
    // work around for testing issue, should be solved when RN version is updated
    this.setState({ mounted: true });
  }

  getHeaders() {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${store.getState().auth.token}`);
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
        if (responseJson.item && responseJson.item.title === title) {
          this.resetNavigationAndNavigateToRoute('Items');
        } else {
          Alert.alert('Item creation failed', 'Something went wrong');
        }
      })
      .catch(error => {
        console.error(error);
      });
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
    console.log('setting new image: ', image, id);
    console.log(this.state.images);
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
