import React from 'react';
import { connect } from 'react-redux';
import { Alert,
    Button,
    Image,
    KeyboardAvoidingView,
    Text,
    TextInput,
    View } from 'react-native';
import { login } from '../redux/actions/auth';
import { generateHeadersForBasicAuth,
    generateHashForRegistering } from '../src/networking';
import {
    localhost,
    loginText,
    registerText } from '../src/static/constants';
import { styles } from '../src/static/styles/LoginStyles';

const logo = require('../src/static/images/logo.png');


export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 'Login',
            username: '',
            password: '',
            email: '',
            textFocused: false,
        };
    }

    getAlternativePageTitle() {
        const { page } = this.state;
        return (page === 'Login') ? 'Sign up' : 'Login';
    }

    getHelperText() {
        const { page } = this.state;
        return (page === 'Login') ? loginText : registerText;
    }

    togglePage() {
        const alternativePage = this.getAlternativePageTitle();
        this.setState({ page: alternativePage });
    }

    handleButtonPress() {
        const {
            page, username, password, email,
        } = this.state;
        if (username === '' || password === '' || (page === 'Sign up' && email === '')) {
            Alert.alert('Invalid values', 'Please enter all the values.');
            return;
        }
        if (page === 'Login') {
            this.handleLoginRequest();
        } else {
            this.handleRegisteringRequest();
        }
    }

    handleRegisteringRequest() {
        const { username, password, email } = this.state;
        const ipAddress = `http://${localhost}:5000/api/v1.0/register`;
        fetch(ipAddress, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_info: generateHashForRegistering(username, password, email),
            }),
        })
            .then(response => response.json())
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

    handleLoginRequest() {
        const ipAddress = `http://${localhost}:5000/api/v1.0/auth`;
        const { username, password } = this.state;
        fetch(ipAddress, {
            method: 'GET',
            headers: generateHeadersForBasicAuth(username, password),
        })
            .then(response => response.json())
            .then((responseJson) => {
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
                    placeholder="Email address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoFocus={false}
                    keyboardType="email-address"
                    value={this.state.email}
                    onFocus={() => this.setState({textFocused: true})}
                    onChangeText={(text) => this.setState({ email: text })}
                    underlineColorAndroid="transparent"
                />
            );
        }
        return null;
    }

    renderLogoAndWelcomeText() {
        if (this.state.textFocused === false) {
            return (
                <View style={styles.logoContainer}>
                  <Text style={styles.welcomeText}>Welcome to NearBuy</Text>
                  <Image
                      resizeMode="contain"
                      style={styles.logo}
                      source={logo}
                  />
                </View>
            );
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
                    <View style={styles.loginContainer}>
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
                            underlineColorAndroid="transparent"
                            onChangeText={(text) => this.setState({ username: text })} />
                        <View style={{margin: 4}}></View>
                        <TextInput
                            placeholder='Password'
                            autoCapitalize='none'
                            autoCorrect={false}
                            secureTextEntry={true}
                            underlineColorAndroid="transparent"
                            onFocus={() => this.setState({textFocused: true})}
                            value={this.state.password}
                            onChangeText={(text) => this.setState({ password: text })} />

                        <Text style={{fontSize: 27}}>{this.state.route}</Text>
                        <Button
                            id='loginButton'
                            onPress={() => this.handleButtonPress()}
                            title={this.state.page}
                        />
                        <View style={styles.altPageContainer}>
                            <Text
                                id='altPageTitle'
                                onPress={() => this.togglePage()}
                                style={{ fontSize: 16, color: 'blue' }}
                            >
                                {this.getAlternativePageTitle()}
                            </Text>
                        </View>
                        <Text
                            id='helperText'
                            style={styles.loginHint}
                        >{this.getHelperText()}</Text>
                    </View>
                </KeyboardAvoidingView>
            </View>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, token) => { dispatch(login(username, token)); },
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Login);
