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
  CHECKING_CREDENTIALS,
  INVALID_CREDS_ALERT,
  localhost,
  loginText,
  MISSING_USER_DETAILS_ALERT,
  NETWORK_ERROR_ALERT,
  networkErrorAlert,
  registerText,
  SUCCESSFUL_REGISTRATION_ALERT,
  USER_EXISTS_ALERT, WAIT_A_SEC
} from '../../static/constants';
import { styles } from '../../static/styles/LoginStyles';
import CredentialsEntry from './CredentialsEntry';
import EmailEntry from './EmailEntry';
import LogoAndWelcomeText from './LogoAndWelcomeText';
import LoginAndRegisterButton from './LoginAndRegisterButton';
import AltPage from './AltPage';
import { navigateToItem } from '../../redux/actions/NavigationAction';
import LoadingAnimation from '../common/LoadingAnimation';

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'Login',
      username: '',
      password: '',
      email: '',
      isKeyboardVisible: false,
      isLoading: false,
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
      Alert.alert(...MISSING_USER_DETAILS_ALERT);
      return;
    }
    this.setState(() => ({ isLoading: true }));
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
      Alert.alert(...SUCCESSFUL_REGISTRATION_ALERT);
      this.setState({ page: 'Login' });
    } else {
      Alert.alert(...USER_EXISTS_ALERT);
    }
    this.setState(() => ({ isLoading: false }));
  }

  handleError(error) {
    this.setState(() => ({ isLoading: false }));
    if (error.message === 'Network request failed') {
      Alert.alert(...NETWORK_ERROR_ALERT);
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
    this.setState(() => ({ isLoading: false }));
    if (response.username === this.state.username) {
      this.props.onLogin(response.username, response.token, response.id);
    } else {
      Alert.alert(...INVALID_CREDS_ALERT);
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

  renderLoginView = () => {
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
  };

  renderLoader = () => {
    return (
      <LoadingAnimation
        animation="penguin"
        topText={CHECKING_CREDENTIALS}
        bottomText={WAIT_A_SEC}
      />
    );
  };

  render() {
    return this.state.isLoading ? this.renderLoader() : this.renderLoginView();
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (username, token, id) => {
      dispatch(login(username, token, id));
      dispatch(navigateToItem('All items'));
    },
  };
};

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(Login);
