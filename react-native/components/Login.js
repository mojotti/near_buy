'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert,
    Button,
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    TextInput,
    View } from 'react-native';
import { login } from '../redux/actions/auth';
import { generateHeadersForBasicAuth,
    generateHashForRegistering } from '../src/networking';
import { localhost,
    loginText,
    registerText,
    widthWithThirtyPercentPadding} from '../src/static/constants';

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

    togglePage () {
        let currentPage = this.getPageTitle(this.state);
        this.setState({ page: currentPage });
    }

    getPageTitle (state) {
        let { page } = state;
        return (page === 'Login') ? 'Sign up' : 'Login';
    }

    getHelperText (state) {
        let { page } = state;
        return (page === 'Login') ? loginText : registerText;
    }

    handleButtonPress(state) {
        const { page, username, password, email } = state;
        if(username === '' || password === '' || (page === 'Sign up' && email === ''))
        {
            Alert.alert('Invalid values', 'Please enter all the values.');
            return;
        }
        if (page === 'Login') {
            this.handleLoginRequest(state)
        } else {
            this.handleRegisteringRequest(state)
        }
    }

    handleRegisteringRequest (state) {
        const { username, password, email } = state;
        let ip_addr = `http://${localhost}:5000/api/v1.0/register`;
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
        });
    }

    handleLoginRequest (state) {
        let ip_addr = `http://${localhost}:5000/api/v1.0/auth`;
        const { username, password } = state;
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
                  <Button onPress={() => this.handleButtonPress(this.state)} title={this.state.page}/>
                  <View style={{marginTop: 40, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text onPress={() => this.togglePage()} style={{fontSize: 16, color: 'blue'}}>
                        {this.getPageTitle(this.state)}
                    </Text>
                  </View>
                  <Text style={[styles.loginHint]}>{this.getHelperText(this.state)}</Text>
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
