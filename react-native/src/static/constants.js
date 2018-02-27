import { Dimensions, Platform } from 'react-native';

const logo = require('./images/logo.png');

const localhost = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
const loginText = "New user? Press 'Sign up' to register.";
const registerText = "Existing user? Press 'Login'.";
const networkErrorAlert =
  'Check your network connection. If that does not help, try again later.';
const widthWithThirtyPercentPadding = Dimensions.get('window').width * 0.7;
const width = Dimensions.get('window').width;

export {
  localhost,
  loginText,
  logo,
  networkErrorAlert,
  registerText,
  widthWithThirtyPercentPadding,
  width,
};
