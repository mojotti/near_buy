'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Dimensions, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, View } from 'react-native';

const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const widthWithThirtyPercentPadding = Dimensions.get('window').width * 0.7;


class NewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      price: '',
      description: '',
    };
  }

  getHeaders() {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + this.props.token);
    return headers;
  }

  handleNewItemCreation () {
    const { title, price, description } = this.state;
    const { navigate } = this.props.navigation;
    if (title == '' || price == '' || description == '') {
      Alert.alert('Invalid values', 'Enter at least price, title and description');
      return;
    }
    fetch('http://' + LOCALHOST + ':5000/api/v1.0/items', {
      method: 'POST',
      body: JSON.stringify({
        'title': title,
        'price': price,
        'description': description
      }),
      headers: this.getHeaders()
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log("pure " + responseJson.item.title);
      if (responseJson.item.title === title) {
        Alert.alert('Item creation', 'Item created successfully!');
        () => navigate('NewItem')
      }
    })
    .catch((error) => {
       console.error(error);
       return;
    });
  }

  onPriceChange(text) {
    let newText = '';
    let numbers = '0123456789';

    for (var i = 0; i < text.length; i++) {
      if ( numbers.indexOf(text[i]) > -1 ) {
        newText = newText + text[i];
      }
    }
    this.setState({price: newText})
}

  static navigationOptions = {
    title: 'Sell item',
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={[styles.container]}>
        <TextInput
          placeholder='Title'
          autoCapitalize='sentences'
          autoCorrect={false}
          autoFocus={true}
          maxLength = {20}
          keyboardType='email-address'
          value={this.state.title}
          onChangeText={(text) => this.setState({ title: text })}
          style={[styles.itemDetails]}
        />
        <TextInput
          placeholder='Description'
          autoCapitalize='sentences'
          maxLength = {60}
          autoCorrect={false}
          autoFocus={false}
          keyboardType='email-address'
          value={this.state.description}
          onChangeText={(text) => this.setState({ description: text })}
          style={[styles.itemDetails]}
        />
        <KeyboardAvoidingView
          behavior='padding'
          keyboardVerticalOffset={164}
        >
          <TextInput
            placeholder='Price'
            autoCorrect={false}
            autoFocus={false}
            keyboardType='numeric'
            maxLength = {5}
            value = {this.state.price}
            onChangeText = {(text) => this.onPriceChange(text)}
            style={[styles.itemDetails]}
          />
          <View style = {{paddingTop: 20}}></View>
          <Button
            onPress = {() => this.handleNewItemCreation()}
            title = {'Submit item'}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  itemDetails: {
    width: widthWithThirtyPercentPadding,
    alignItems: 'center',
  }
});

const mapStateToProps = (state, ownProps) => {
    return {
        username: state.auth.username,
        token: state.auth.token
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogout: () => { dispatch(logout()); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItem);
