'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, ScrollView, Text, TextInput, View, Button, Platform, StyleSheet,
  Image, KeyboardAvoidingView } from 'react-native';
import { login } from '../redux/actions/auth';

const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const base64 = require('base-64');
const loginText = "New user? Press 'Sign up' to register.";
const registerText = "Existing user? Press 'Login'.";


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

    togglePage (e) {
      this.setState({ page: this.altLoginSignup });
      e.preventDefault();
    }

    get altLoginSignup () { return (this.state.page === 'Login')
          ? 'Sign up' : 'Login'; }

    get altHelperText () { return (this.state.page === 'Login')
          ? loginText : registerText; }

    getHeaders() {
      var headers = new Headers();
      var hash = this.getHash();
      headers.append("Authorization", "Basic " + hash);
      return headers;
    }
    
    getHash() {
      var credentials = this.state.username + ':' + this.state.password
      return base64.encode(credentials);
    }

    handleLoginRequest (e) {
      e.preventDefault();
      var headers = this.getHeaders();

      fetch('http://' + LOCALHOST + ':5000/api/v1.0/auth', {
         method: 'GET',
         headers: this.getHeaders()
      })

      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        if (responseJson.login === 'success') {
          this.props.onLogin(this.state.username, this.getHash());
        } else {
          Alert.alert('Try again, mate!', 'Invalid credentials.');
          this.setState({ password: '' });
        }
      })

      .catch((error) => {
         console.error(error);
         return;
      });
    }

    render () {
      return (
          <View style={[styles.container]}>
            <KeyboardAvoidingView
            behavior='padding'
            keyboardVerticalOffset={-70}
            >
            <View style={[styles.logoContainer]}>
              <Text style={[styles.welcomeText]}>Welcome to NearBuy</Text>
              <Image
                resizeMode="contain"
                style={styles.logo}
                source={require('./../logo.png')}
              />
            </View>

            <View style={[styles.loginContainer]}>
            <TextInput
                placeholder='Username'
                autoCapitalize='none'
                autoCorrect={false}
                autoFocus={false}
                keyboardType='email-address'
                value={this.state.username}
                onChangeText={(text) => this.setState({ username: text })} />
            <View style={{margin: 4}}/>
            <TextInput
                placeholder='Password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })} />

              <Text style={{fontSize: 27}}>{this.state.route}</Text>
              <Button onPress={(e) => this.handleLoginRequest(e)} title={this.state.page}/>
              <View style={{marginTop: 55, flexDirection: 'row', justifyContent: 'center'}}>
                <Text onPress={(e) => this.togglePage(e)} style={{fontSize: 14, color: 'blue'}}>
                    {this.altLoginSignup}
                </Text>
              </View>
              <Text style={[styles.loginHint]}>{this.altHelperText}</Text>
          </View>
          </KeyboardAvoidingView>
        </View>
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
        onLogin: (username, hash) => { dispatch(login(username, hash)); },
        onSignUp: (username, password) => { dispatch(signup(username, password)); }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  welcomeText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 50
  },
  loginHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  logo: {
    width: 350,
    height: 150,
  },
  loginContainer: {
    justifyContent: 'center',
    alignSelf: 'stretch',
    padding: 80
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
