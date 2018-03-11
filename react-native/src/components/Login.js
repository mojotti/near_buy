import React from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from 'react-native';
import { login } from '../../redux/actions/auth';
import {
  generateHeadersForBasicAuth,
  getHeadersForRegistering,
  generateHashForRegistering,
} from '../networking/networking';
import {
  localhost,
  loginText,
  logo,
  networkErrorAlert,
  registerText,
} from '../static/constants';
import { styles } from '../static/styles/LoginStyles';

const LOGO = logo;

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'Login',
      username: '',
      password: '',
      email: '',
      isKeyboardVisible: false,
    };

    this.keyboardDidHide = this.keyboardDidHide.bind(this);
    this.keyboardDidShow = this.keyboardDidShow.bind(this);
    this.handleLoginRequest = this.handleLoginRequest.bind(this);
    this.handleRegisteringRequest = this.handleRegisteringRequest.bind(this);
    this.handleRegisteringResponse = this.handleRegisteringResponse.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow,
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide,
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  getAlternativePageTitle() {
    const { page } = this.state;
    return page === 'Login' ? 'Sign up' : 'Login';
  }

  getHelperText() {
    const { page } = this.state;
    return page === 'Login' ? loginText : registerText;
  }

  keyboardDidShow() {
    this.setState({ isKeyboardVisible: true });
  }

  keyboardDidHide() {
    this.setState({ isKeyboardVisible: false });
  }

  togglePage() {
    const alternativePage = this.getAlternativePageTitle();
    this.setState({ page: alternativePage });
  }

  handleButtonPress() {
    const { page, username, password, email } = this.state;
    const hasInvalidUserDetails =
      username === '' ||
      password === '' ||
      (page === 'Sign up' && email === '');

    if (hasInvalidUserDetails) {
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
      headers: getHeadersForRegistering(),
      body: JSON.stringify({
        user_info: generateHashForRegistering(username, password, email),
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.handleRegisteringResponse(responseJson);
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  handleRegisteringResponse(response) {
    if (response.user_creation === 'success') {
      Alert.alert('User creation', 'User created successfully!');
      this.setState({ page: 'Login' });
    } else {
      Alert.alert('User creation', 'User exists already!');
    }
  }

  handleError(error) {
    if (error.message === 'Network request failed') {
      Alert.alert('Oops!', networkErrorAlert);
    }
  }

  handleLoginRequest() {
    const ipAddress = `http://${localhost}:5000/api/v1.0/auth`;
    const { username, password } = this.state;
    fetch(ipAddress, {
      method: 'GET',
      headers: generateHeadersForBasicAuth(username, password),
    })
      .then(response => response.json())
      .then(responseJson => {
        this.handleLoginResponse(responseJson);
      })
      .catch(error => {
        this.handleError(error);
      });
  }

  handleLoginResponse(response) {
    if (response.username === this.state.username) {
      this.props.onLogin(this.state.username, response.token);
    } else {
      Alert.alert('Try again, mate!', 'Invalid credentials.');
      this.setState({ password: '' });
    }
  }

  renderEmailInput() {
    if (this.state.page === 'Sign up') {
      return (
        <TextInput
          id="emailTextInput"
          placeholder="Email address"
          style={styles.textInputStyleNegativeMargin}
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={false}
          keyboardType="email-address"
          value={this.state.email}
          onChangeText={text => this.setState({ email: text })}
          underlineColorAndroid="transparent"
        />
      );
    }
    return null;
  }

  renderLogoAndWelcomeText() {
    if (!this.state.isKeyboardVisible) {
      return (
        <View style={styles.logoContainer}>
          <Text style={styles.welcomeText}>Hi! Welcome to</Text>
          <Image resizeMode="contain" style={styles.logo} source={LOGO} />
        </View>
      );
    }
    return null;
  }

  render() {
    const behavior = Platform.OS === 'ios' ? 'padding' : null;
    return (
      <View style={[styles.container]}>
        <KeyboardAvoidingView behavior={behavior} keyboardVerticalOffset={64}>
          {this.renderLogoAndWelcomeText()}
          <View style={styles.loginContainer}>
            {this.renderEmailInput()}
            <TextInput
              id="usernameTextInput"
              placeholder="Username"
              style={styles.textInputStyleNegativeMargin}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
              value={this.state.username}
              underlineColorAndroid="transparent"
              onChangeText={text => this.setState({ username: text })}
            />
            <TextInput
              id="passwordTextInput"
              placeholder="Password"
              autoCapitalize="none"
              style={styles.textInputStyleLargeMargin}
              autoCorrect={false}
              secureTextEntry={true}
              underlineColorAndroid="transparent"
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />

            <TouchableHighlight
              id="loginButton"
              onPress={() => this.handleButtonPress()}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>{this.state.page}</Text>
            </TouchableHighlight>
            <View style={styles.altPageContainer}>
              <Text
                id="altPageTitle"
                onPress={() => this.togglePage()}
                style={styles.altPageTitle}
              >
                {this.getAlternativePageTitle()}
              </Text>
            </View>
            <Text id="helperText" style={styles.loginHint}>
              {this.getHelperText()}
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.authorizationReducer.isLoggedIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (username, token) => {
      dispatch(login(username, token));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
