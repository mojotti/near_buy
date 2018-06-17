import React from 'react';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch'; // for headers, fetch, etc.

import { Alert } from 'react-native';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Login } from '../../src/components/login/Login';
import {
  loginText,
  registerText,
  SUCCESSFUL_REGISTRATION_ALERT,
  USER_EXISTS_ALERT,
  MISSING_USER_DETAILS_ALERT,
  NETWORK_ERROR_ALERT,
  INVALID_CREDS_ALERT,
  NETWORK_ERROR,
} from '../../src/static/constants';
import {
  successfulRegisteringResponse,
  successfulLoginResponse,
  unsuccessfulLoginResponse,
  userExistsRegisteringResponse,
} from '../__mocks__/loginAndRegisteringSamples';

const onLoginSpy = sinon.spy();
const mockedProps = {
  onLogin: onLoginSpy,
};

describe('Login', () => {
  let loginComponent;

  beforeEach(() => {
    Alert.alert = jest.fn();
    loginComponent = shallow(<Login {...mockedProps} />);
  });

  test('given username is missing, when sign-up-button is pressed, then alert is shown', () => {
    loginComponent.setState({
      page: 'Sign up',
      username: '',
      password: 'bar',
      email: 'foo@bar.com',
    });

    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');
    loginButton.simulate('Press');

    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([MISSING_USER_DETAILS_ALERT]);
  });

  test('given email is missing, when sign-up-button is pressed, then alert is shown', () => {
    loginComponent.setState({
      page: 'Sign up',
      username: 'foo',
      password: 'bar',
      email: '',
    });

    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');
    loginButton.simulate('Press');

    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([MISSING_USER_DETAILS_ALERT]);
  });

  test('given pw is missing, when sign-up-button is pressed, then alert is shown', () => {
    loginComponent.setState({
      page: 'Sign up',
      username: 'foo',
      password: '',
      email: 'foo@bar.com',
    });

    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');
    loginButton.simulate('Press');

    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([MISSING_USER_DETAILS_ALERT]);
  });

  test('given username is missing, when login-button is pressed, then alert is shown', () => {
    loginComponent.setState({
      page: 'Login',
      username: '',
      password: 'bar',
      email: 'foo@bar.com',
    });

    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');
    loginButton.simulate('Press');

    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([MISSING_USER_DETAILS_ALERT]);
  });

  test('alert is raised when network error occurs', () => {
    const error = {
      message: 'Network request failed',
    };
    loginComponent.instance().handleError(error);

    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([NETWORK_ERROR_ALERT]);
  });

  test('given pw is missing, when login-button is pressed, then alert is shown', () => {
    fetch.mockResponseSuccess(successfulLoginResponse);

    loginComponent.setState({
      page: 'Login',
      username: 'foo',
      password: '',
    });
    const render = loginComponent.find('LoginAndRegisterButton').dive();

    const loginButton = render.find('[id="loginButton"]');
    loginButton.simulate('Press');

    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([MISSING_USER_DETAILS_ALERT]);
  });

  test('given all details are missing, when login-button is pressed, then alert is shown', () => {
    loginComponent.setState({
      page: 'Login',
      username: '',
      password: '',
      email: '',
    });
    const render = loginComponent.find('LoginAndRegisterButton').dive();

    const loginButton = render.find('[id="loginButton"]');
    loginButton.simulate('Press');

    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([MISSING_USER_DETAILS_ALERT]);
  });

  test('given state is login, when login-button is pressed, then alert is not shown', () => {
    // to avoid errors in fetch
    fetch.mockResponseSuccess(unsuccessfulLoginResponse);

    loginComponent.setState({
      page: 'Login',
      username: 'foo',
      password: 'bar',
      email: 'foo@bar.com',
    });

    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');
    loginButton.simulate('Press');

    // alert would be risen even before fetch
    expect(Alert.alert.mock.calls.length).toBe(0);
  });

  test('when sign-up is successful, alert is shown', () => {
    fetch.mockResponseSuccess(successfulRegisteringResponse);

    loginComponent.setState({
      page: 'Sign up',
      username: 'foo',
      password: 'bar',
      email: 'foo@bar.com',
    });

    loginComponent.update();
    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');

    // just to see if errors in fetch
    loginButton.simulate('Press');

    // testing the actual fetch logic
    loginComponent
      .instance()
      .handleRegisteringResponse(successfulRegisteringResponse);

    expect(loginComponent.state('page')).toEqual('Login');
    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([SUCCESSFUL_REGISTRATION_ALERT]);
  });

  test('when existing user is tried to be registered, alert is shown and registration fails', () => {
    fetch.mockResponseSuccess(userExistsRegisteringResponse);

    loginComponent.setState({
      page: 'Sign up',
      username: 'foo',
      password: 'bar',
      email: 'foo@bar.com',
    });

    loginComponent.update();
    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');

    // just to see if errors in fetch
    loginButton.simulate('Press');

    // testing the actual fetch logic
    loginComponent
      .instance()
      .handleRegisteringResponse(userExistsRegisteringResponse);

    expect(loginComponent.state('page')).toEqual('Sign up');
    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([USER_EXISTS_ALERT]);
  });

  test('when error is risen in registering, it is handled', () => {
    fetch.mockResponseFailure(NETWORK_ERROR);

    loginComponent.setState({
      page: 'Sign up',
      username: 'foo',
      password: 'bar',
      email: 'foo@bar.com',
    });

    loginComponent.update();
    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');

    // just to see if errors in fetch
    loginButton.simulate('Press');
  });

  test('when error is risen in login, it is handled', () => {
    fetch.mockResponseFailure([NETWORK_ERROR]);

    loginComponent.setState({
      page: 'Login',
      username: 'foo',
      password: 'bar',
    });

    loginComponent.update();
    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');

    // just to see if errors in fetch
    loginButton.simulate('Press');
  });

  test('when logging in with invalid creds, alert is shown and login fails', () => {
    fetch.mockResponseSuccess(unsuccessfulLoginResponse);

    loginComponent.setState({
      page: 'Sign up',
      username: 'foo',
      password: 'bar',
      email: 'foobar',
    });

    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');

    // just to see if errors in fetch
    loginButton.simulate('Press');

    // testing the actual fetch logic
    loginComponent.instance().handleLoginResponse(unsuccessfulLoginResponse);

    expect(loginComponent.state('password')).toEqual('');
    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual([INVALID_CREDS_ALERT]);
  });

  test('when logging in with correct creds, user is logged in', () => {
    fetch.mockResponseSuccess(successfulLoginResponse);

    loginComponent.setState({
      page: 'Sign up',
      username: 'foo',
      password: 'bar',
      email: 'foobar',
    });

    const render = loginComponent.find('LoginAndRegisterButton').dive();
    const loginButton = render.find('[id="loginButton"]');

    // just to see if errors in fetch
    loginButton.simulate('Press');

    // testing the actual fetch logic
    loginComponent.instance().handleLoginResponse(successfulLoginResponse);

    expect(loginComponent.state('password')).toEqual('bar');
    expect(onLoginSpy.called).toBeTruthy();
    expect(onLoginSpy.args[0][0]).toEqual(successfulLoginResponse.username);
    expect(onLoginSpy.args[0][1]).toEqual(successfulLoginResponse.token);
  });

  test('Given current page is login, when page title is requested, then title is Sign up', () => {
    loginComponent.setState({
      page: 'Login',
      username: '',
      password: '',
      email: '',
    });

    const render = loginComponent.find('AltPage').dive();
    const button = render.find('[id="altPageTitle"]');
    expect(button.props().children).toBe('Sign up');
  });

  test('Given current page is sign up, when page title is requested, then title is Login', () => {
    loginComponent.setState({
      page: 'Sign up',
      username: '',
      password: '',
      email: '',
    });

    const render = loginComponent.find('AltPage').dive();
    const button = render.find('[id="altPageTitle"]');
    expect(button.props().children).toBe('Login');
  });

  test('Given current page is login, when helper text is requested, then text is login', () => {
    loginComponent.setState({
      page: 'Login',
      username: '',
      password: '',
      email: '',
    });

    const render = loginComponent.find('AltPage').dive();
    const button = render.find('[id="helperText"]');
    expect(button.props().children).toBe(loginText);
  });

  test('Given current page is sign up, when helper text is requested, then text is sign up', () => {
    loginComponent.setState({
      page: 'Sign up',
      username: '',
      password: '',
      email: '',
    });

    const render = loginComponent.find('AltPage').dive();
    const button = render.find('[id="helperText"]');
    expect(button.props().children).toBe(registerText);
  });

  test('renders sign up details when state is sign up', () => {
    const loginComp = renderer.create(<Login {...mockedProps} />);
    expect(loginComp.getInstance().state.page).toEqual('Login');

    loginComp.getInstance().togglePage();
    expect(loginComp.getInstance().state.page).toEqual('Sign up');

    const tree = loginComp.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('Logo is hidden when keyboard is visible', () => {
    const loginComp = renderer.create(<Login {...mockedProps} />);
    loginComp.getInstance().keyboardDidShow();

    expect(loginComp.getInstance().state.isKeyboardVisible).toBeTruthy();

    const tree = loginComp.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test('isKeyboardVisible is set to false when keyboard is hidden', () => {
    expect(loginComponent.state('isKeyboardVisible')).toBeFalsy();

    loginComponent.setState({ isKeyboardVisible: true });
    loginComponent.instance().keyboardDidHide();

    expect(loginComponent.state('isKeyboardVisible')).toBeFalsy();
  });

  test('credential change is handled correctly', () => {
    expect(loginComponent.state('username')).toEqual('');
    expect(loginComponent.state('password')).toEqual('');

    loginComponent
      .instance()
      .handleCredentialChange({ username: 'foo', password: null });

    expect(loginComponent.state('username')).toEqual('foo');
    expect(loginComponent.state('password')).toEqual('');

    loginComponent
      .instance()
      .handleCredentialChange({ username: null, password: 'bar' });

    expect(loginComponent.state('username')).toEqual('foo');
    expect(loginComponent.state('password')).toEqual('bar');
  });

  test('email is changed', () => {
    expect(loginComponent.state('email')).toEqual('');

    loginComponent.instance().handleEmailChange('foo@bar.com');

    expect(loginComponent.state('email')).toEqual('foo@bar.com');
  });
});
