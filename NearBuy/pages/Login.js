'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, Text, TextInput, View, Button, Platform } from 'react-native';
import { login } from '../redux/actions/auth';
const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const base64 = require('base-64');

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            page: 'Login',
            username: '',
            password: ''
        };
    }

    userLogin (e) {
        this.props.onLogin(this.state.username, this.state.password);
        e.preventDefault();
    }

    toggleRoute (e) {
      let alt = (this.state.route === 'Login') ? 'SignUp' : 'Login';
      this.setState({ route: alt });
      e.preventDefault();
    }

    togglePage (e) {
      this.setState({ page: this.alt });
      e.preventDefault();
    }

    get alt () { return (this.state.page === 'Login') ? 'SignUp' : 'Login'; }

    getHeaders() {
      var headers = new Headers();
      var credentials = this.state.username + ':' + this.state.password
      headers.append("Authorization", "Basic " +
                      base64.encode(credentials));
      return headers;
    }

    handleLoginRequest (e) {
      e.preventDefault();
      var headers = this.getHeaders();

      fetch('http://' + LOCALHOST + ':5000/todo/api/v1.0/auth', {
         method: 'GET',
         headers: this.getHeaders()
      })

      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.login === 'success') {
          this.props.onLogin(this.state.username, this.state.password);
        }
      })

      .catch((error) => {
         console.error(error);
         this.setState({ username: '', password: '' });
         return;
      });
    }

    render () {
      let alt = (this.state.route === 'Login') ? 'SignUp' : 'Login';
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
          <View style={{margin: 7}}/>
          <Button onPress={(e) => this.handleLoginRequest(e)} title={this.state.page}/>
          <View style={{margin: 7, flexDirection: 'row', justifyContent: 'center'}}>
          <Text onPress={(e) => this.togglePage(e)} style={{fontSize: 12, color: 'blue'}}>
              {this.alt}
          </Text>
        </View>
      </ScrollView>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, password) => { dispatch(login(username, password)); },
        onSignUp: (username, password) => { dispatch(signup(username, password)); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
