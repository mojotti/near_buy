'use strict';

import React from 'react';
import store from '../redux';
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
import { alertInvalidValuesNewItem, localhost } from '../src/static/constants';
import { styles } from '../src/static/styles/NewItemStyles';

export class NewItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      price: '',
      description: '',
      mounted: false,
    };
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

  handlePriceChange(text) {
    let newText = '';
    let numbers = '0123456789';

    for (let i = 0; i < text.length; i++) {
      if (numbers.indexOf(text[i]) > -1) {
        newText = newText + text[i];
      }
    }
    this.setState({ price: newText });
  }

  renderTextInputs = () => {
    return (
      <View>
        <View style={styles.itemDetailContainer}>
          <TextInput
            placeholder="Title"
            autoCapitalize="sentences"
            autoCorrect={false}
            autoFocus={this.state.mounted}
            maxLength={40}
            keyboardType="email-address"
            value={this.state.title}
            onChangeText={text => this.setState({ title: text })}
            style={[styles.itemDetails]}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.itemDescriptionContainer}>
          <TextInput
            placeholder="Description"
            autoCapitalize="sentences"
            maxLength={400}
            autoCorrect={false}
            keyboardType="email-address"
            value={this.state.description}
            multiline={true}
            onChangeText={text => this.setState({ description: text })}
            style={[styles.itemDetails]}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.itemDetailContainer}>
          <TextInput
            placeholder="Price"
            autoCorrect={false}
            autoFocus={false}
            keyboardType="numeric"
            maxLength={5}
            value={this.state.price}
            onChangeText={text => this.handlePriceChange(text)}
            style={[styles.itemDetails]}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
    );
  };

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

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerText}>Item details</Text>
          {this.renderTextInputs()}
          <Text style={styles.headerText}>Add pictures</Text>
          {this.showImagePicker()}
          {this.renderSubmitButton()}
        </View>
      </ScrollView>
    );
  }
}

export default NewItem;
