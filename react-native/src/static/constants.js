import { Dimensions, Platform } from 'react-native';

export const logo = require('./images/logo.png');

export const localhost = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';
export const loginText = "New user? Press 'Sign up' to register.";
export const registerText = "Existing user? Press 'Login'.";
export const networkErrorAlert =
  'Check your network connection. If that does not help, try again later.';
export const widthWithThirtyPercentPadding =
  Dimensions.get('window').width * 0.7;
export const width = Dimensions.get('window').width;

export const userHasNoItemsHeader = `You have no items yet.`;
export const userHasNoItemsContainer = `Add one by clicking 'New item'.`;
export const alertInvalidValuesNewItem = [
  'Invalid values',
  'Enter at least price, title and description',
];

export const SUCCESSFUL_REGISTRATION_ALERT = [
  'User creation',
  'User created successfully!',
];
export const USER_EXISTS_ALERT = ['User creation', 'User exists already!'];
export const MISSING_USER_DETAILS_ALERT = [
  'Invalid values',
  'Please enter all the values.',
];
export const INVALID_CREDS_ALERT = ['Try again, mate!', 'Invalid credentials.'];
export const NETWORK_ERROR_ALERT = ['Oops!', networkErrorAlert];
export const NETWORK_ERROR = 'network error!';

export const DELETION_ERROR = [
  'Oopsie Woopsie!',
  'Something went wrong, please check your network connection & try again!',
];

export const NO_ITEMS_TEXT_HEADER = 'Oops! Could not find any items.';
export const NO_ITEMS_TEXT_CONTENT = 'Perhaps you are in the middle of nowhere.';
