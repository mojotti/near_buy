'use strict';

import React from 'react';
import { ScrollView, Text, TextInput, View, Button, Platform } from 'react-native';
import HomeScreen from './HomeScreen';
const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const base64  = require('base-64');


export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login',
  };

  state = {
    username: '',
    password: ''
  }

  getHeaders() {
    var headers = new Headers();
    headers.append("Authorization", "Basic " +
                    base64.encode('${this.username}:${this.password}'));
    return headers;
  }
  handleLogin() {
    var headers = this.getHeaders();
    if (1<2)
    console.log("painoin");
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ScrollView style={{padding: 20}}>
        <Text style={{fontSize: 27}}>{this.state.route}</Text>
        <TextInput
            placeholder='Username'
            autoCapitalize='none'
            autoCorrect={false}
            autoFocus={true}
            keyboardType='email-address'
            value={this.state.username}
            onChangeText={(text) => this.setState({ username: text })} />
        <TextInput
            placeholder='Password'
            autoCapitalize='none'
            autoCorrect={false}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(text) => this.setState({ password: text })} />
        <View style={{margin: 7}}/>
        <Button
          title="Login"
          onPress={() =>  navigate('Home')}
        />
    </ScrollView>
    );
  }
}
