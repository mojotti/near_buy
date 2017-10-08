'use strict';


import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, ScrollView, Text, TextInput, View, Button, Platform, StyleSheet,
  Image, KeyboardAvoidingView } from 'react-native';
import { login } from '../redux/actions/auth';
import { generateHeadersForBasicAuth,
  generateHashForRegistering } from '../src/networking';


const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const loginText = "New user? Press 'Sign up' to register.";
const registerText = "Existing user? Press 'Login'.";


class Login extends Component {
  constructor (props) {
    super(props);
    this.state = {
      page: 'Login',
      username: '',
      password: '',
      email: '',
      textFocused: false
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

  handleButtonPress(e) {
    e.preventDefault();
    if((this.state.username === '' || this.state.password === '' ||
      (this.state.page === 'Sign up' && this.state.email === '')))
    {
      Alert.alert('Invalid values', 'Please enter all the values.');
      return;
    }
    if (this.state.page === 'Login') {
      this.handleLoginRequest(e)
    } else {
      this.handleRegisteringRequest()
    }
  }

  handleRegisteringRequest () {
    fetch('http://' + LOCALHOST + ':5000/api/v1.0/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'user_info': generateHashForRegistering(this.state.username,
          this.state.password, this.state.email)
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.user_creation === 'success') {
        Alert.alert('User creation', 'User created successfully!');
        console.log(responseJson);
        this.setState({ page: 'Login' });
      } else {
        Alert.alert('User creation', 'User exists already!');
      }
    })
    .catch((error) => {
       console.error(error);
       return;
    });
  }

  handleLoginRequest (e) {
    e.preventDefault();

    fetch('http://' + LOCALHOST + ':5000/api/v1.0/auth', {
       method: 'GET',
       headers: generateHeadersForBasicAuth(this.state.username, this.state.password)
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      if (responseJson.username === this.state.username) {
        this.props.onLogin(this.state.username, responseJson.token);
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

  renderEmailInput() {
    if (this.state.page === 'Sign up') {
      return (
        <TextInput
          placeholder='Email address'
          autoCapitalize='none'
          autoCorrect={false}
          autoFocus={false}
          keyboardType='email-address'
          value={this.state.email}
          onFocus={() => this.setState({textFocused: true})}
          onChangeText={(text) => this.setState({ email: text })}
        />
      )
    }
  }

  renderLogoAndWelcomeText() {
    if (this.state.textFocused === false) {
      return (
        <View style={[styles.logoContainer]}>
          <Text style={[styles.welcomeText]}>Welcome to NearBuy</Text>
          <Image
            resizeMode="contain"
            style={styles.logo}
            source={require('./../logo.png')}
          />
        </View>
      )
    }
  }

  render () {
    return (
        <View style={[styles.container]}>
          <KeyboardAvoidingView
            behavior='padding'
            keyboardVerticalOffset={64}
          >
          {this.renderLogoAndWelcomeText()}
          <View style={[styles.loginContainer]}>
            {this.renderEmailInput()}
            <View style={{margin: 4}}></View>
            <TextInput
                placeholder='Username'
                autoCapitalize='none'
                autoCorrect={false}
                autoFocus={false}
                onFocus={() => this.setState({textFocused: true})}
                keyboardType='email-address'
                value={this.state.username}
                onChangeText={(text) => this.setState({ username: text })} />
            <View style={{margin: 4}}></View>
            <TextInput
                placeholder='Password'
                autoCapitalize='none'
                autoCorrect={false}
                secureTextEntry={true}
                onFocus={() => this.setState({textFocused: true})}
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })} />

              <Text style={{fontSize: 27}}>{this.state.route}</Text>
              <Button onPress={(e) => this.handleButtonPress(e)} title={this.state.page}/>
              <View style={{marginTop: 40, flexDirection: 'row', justifyContent: 'center'}}>
                <Text onPress={(e) => this.togglePage(e)} style={{fontSize: 16, color: 'blue'}}>
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
        onLogin: (username, token) => { dispatch(login(username, token)); },
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
    padding: 40
  },
  logoContainer: {
    justifyContent: 'center',
    alignSelf: 'stretch',
    padding: 0
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
