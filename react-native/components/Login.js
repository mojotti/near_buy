'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert,
    Button,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View } from 'react-native';
import { login } from '../redux/actions/auth';
import { generateHeadersForBasicAuth,
    generateHashForRegistering } from '../src/networking';
import { NetworkInfo } from 'react-native-network-info';


const LOCALHOST = (Platform.OS === 'ios') ? 'localhost' : '10.0.2.2';
const loginText = "New user? Press 'Sign up' to register.";
const registerText = "Existing user? Press 'Login'.";
const widthWithThirtyPercentPadding = Dimensions.get('window').width * 0.7;


export class Login extends Component {
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

    userLogin () {
        this.props.onLogin(this.state.username, this.state.password);
    }

    togglePage () {
        this.setState({ page: this.altLoginSignup });
    }

    get altLoginSignup () { return (this.state.page === 'Login')
        ? 'Sign up' : 'Login'; }

    get altHelperText () { return (this.state.page === 'Login')
        ? loginText : registerText; }

    handleButtonPress() {
        const { page, username, password, email } = this.state;
        if(username === '' || password === '' || (page === 'Sign up' && email === ''))
        {
            Alert.alert('Invalid values', 'Please enter all the values.');
            return;
        }
        if (page === 'Login') {
            this.handleLoginRequest()
        } else {
            this.handleRegisteringRequest()
        }
    }

    handleRegisteringRequest () {
        const { username, password, email } = this.state;
        let ip_addr = `http://${LOCALHOST}:5000/api/v1.0/register`;
        fetch(ip_addr, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'user_info': generateHashForRegistering(username, password, email)
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
                console.log('error ', error);
                console.error(error);
                return;
            });
    }

    handleLoginRequest () {
        let ip_addr = `http://${LOCALHOST}:5000/api/v1.0/auth`;
        const { username, password } = this.state;
        fetch(ip_addr, {
            method: 'GET',
            headers: generateHeadersForBasicAuth(username, password)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.username === username) {
                    this.props.onLogin(username, responseJson.token);
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
                  <Button onPress={() => this.handleButtonPress()} title={this.state.page}/>
                  <View style={{marginTop: 40, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text onPress={() => this.togglePage()} style={{fontSize: 16, color: 'blue'}}>
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
        alignSelf: 'center',
        width: widthWithThirtyPercentPadding,
    },
    logoContainer: {
        justifyContent: 'center',
        alignSelf: 'stretch',
        padding: 0
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
