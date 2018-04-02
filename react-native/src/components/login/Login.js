import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  View,
} from 'react-native';
import { login } from '../../redux/actions/AuthorizationAction';
import {
  generateHeadersForBasicAuth,
  getHeadersForRegistering,
  generateHashForRegistering,
} from '../../networking/networking';
import {
  localhost,
  loginText,
  networkErrorAlert,
  registerText,
} from '../../static/constants';
import { styles } from '../../static/styles/LoginStyles';
import CredentialsEntry from './CredentialsEntry';
import EmailEntry from './EmailEntry';
import LogoAndWelcomeText from './LogoAndWelcomeText';
import LoginAndRegisterButton from './LoginAndRegisterButton';
import AltPage from './AltPage';

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
    this.handleCredentialChange = this.handleCredentialChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleButtonPress = this.handleButtonPress.bind(this);
    this.togglePage = this.togglePage.bind(this);
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

  keyboardDidShow() {
    this.setState(() => ({ isKeyboardVisible: true }));
  }

  keyboardDidHide() {
    this.setState(() => ({ isKeyboardVisible: false }));
  }

  togglePage() {
    const alternativePage = this.state.page === 'Login' ? 'Sign up' : 'Login';
    this.setState(() => ({ page: alternativePage }));
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
      this.setState(() => ({ password: '' }));
    }
  }

  handleCredentialChange(newCreds) {
    if (newCreds.username !== null) {
      this.setState(() => ({ username: newCreds.username }));
    }
    if (newCreds.password !== null) {
      this.setState(() => ({ password: newCreds.password }));
    }
  }

  handleEmailChange(newEmail) {
    this.setState(() => ({ email: newEmail }));
  }

  render() {
    const behavior = Platform.OS === 'ios' ? 'padding' : null;
    const emailProps = {
      email: this.state.email,
      handleEmailChange: this.handleEmailChange,
    };
    const credsProps = {
      username: this.state.username,
      password: this.state.password,
      handleCredentialChange: this.handleCredentialChange,
    };
    const altPageProps = {
      togglePage: this.togglePage,
      page: this.state.page,
    };

    return (
      <View style={[styles.container]}>
        <KeyboardAvoidingView behavior={behavior} keyboardVerticalOffset={64}>
          {!this.state.isKeyboardVisible && <LogoAndWelcomeText />}
          <View style={styles.loginContainer}>
            {this.state.page === 'Sign up' && <EmailEntry {...emailProps} />}
            <CredentialsEntry {...credsProps} />
            <LoginAndRegisterButton
              text={this.state.page}
              handlePress={this.handleButtonPress}
            />
            <AltPage {...altPageProps} />
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (username, token) => {
      dispatch(login(username, token));
    },
  };
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
