'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Button, Platform, StyleSheet, Text, TextInput, View }
  from 'react-native';

const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';


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
    console.log("vittu"+ headers)
    return headers;
  }

  handleNewItemCreation () {
    const title = this.state.title;
    const price = this.state.price;
    const description = this.state.description;
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
      if (responseJson.user_creation === 'item') {
        Alert.alert('Item creation', 'Item created successfully!');
        console.log(responseJson);
      }
    })
    .catch((error) => {
       console.error(error);
       return;
    });
  }

  static navigationOptions = {
    title: 'Sell item',
  };

  render() {
    return (
      <View style={[styles.container]}>
        <TextInput
          placeholder='Title'
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus={false}
          keyboardType='email-address'
          value={this.state.title}
          onChangeText={(text) => this.setState({ title: text })}
        />
        <TextInput
          placeholder='Description'
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus={false}
          keyboardType='email-address'
          value={this.state.description}
          onChangeText={(text) => this.setState({ description: text })}
        />
        <TextInput
          placeholder='Price'
          autoCorrect={false}
          autoFocus={false}
          keyboardType='numeric'
          value={this.state.price}
          onChangeText={(number) => this.setState({ price: number })}
        />
        <Button onPress={() => this.handleNewItemCreation()} title={'Submit item'}/>
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
