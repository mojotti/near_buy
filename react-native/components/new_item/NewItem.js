'use strict';

import React from 'react';
import store from '../../redux/index';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { NavigationActions } from 'react-navigation';
import {
  alertInvalidValuesNewItem,
  localhost,
} from '../../src/static/constants';
import { styles } from '../../src/static/styles/NewItemStyles';
import { ItemDetails } from './ItemDetails';

export class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      price: '',
      description: '',
      mounted: false,
    };

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
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
    let url = `http://${localhost}:5000/api/v1.0/items`;
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

  showImagePicker() {
    return (
      <TouchableHighlight
        id="AddImageButton"
        onPress={() => this.openPicker()}
        style={styles.submitButton}
      >
        <Text style={styles.submitText}>{'Add photo'}</Text>
      </TouchableHighlight>
    );
  }

  openPicker() {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
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
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerText}>Item details</Text>
          <ItemDetails {...itemDetailsProps} />
          <Text style={styles.headerText}>Add pictures</Text>
          {this.showImagePicker()}
          {this.renderSubmitButton()}
        </View>
      </ScrollView>
    );
  }
}

export default NewItem;
