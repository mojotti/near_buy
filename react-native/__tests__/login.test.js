import React from 'react';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch'; // for headers, fetch, etc.

import { Alert } from 'react-native';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Login } from '../components/Login';
import {
    loginText,
    registerText,
} from '../src/static/constants';
import {
    successfulRegisteringResponse,
    successfulLoginResponse,
    unsuccessfulLoginResponse,
    userExistsRegisteringResponse,
} from '../src/static/samples/loginAndRegisteringSamples';

describe('Login', () => {
    let loginComponent;

    beforeEach(() => {
        Alert.alert = jest.fn(() => {
            return Promise.resolve('alert');
        });
        loginComponent = shallow(<Login />);
    });

    test('given state is login, when login-button is pressed, then alert is not raised', async () => {
        fetch.mockResponseSuccess(unsuccessfulLoginResponse);

        loginComponent.setState({
            page: 'Login',
            username: 'foo',
            password: 'bar',
            email: 'foo@bar.com',
        });

        const render = loginComponent.dive();
        const loginButton = render.find('[id="loginButton"]');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(0);
    });

    test('given state is sign-up, when sign-up-button is pressed, then alert is not raised', async () => {
        fetch.mockResponseSuccess(successfulRegisteringResponse);

        loginComponent.setState({
            page: 'Sign up',
            username: 'foo',
            password: 'bar',
            email: 'foo@bar.com',
        });

        const render = loginComponent.dive();
        const loginButton = render.find('[id="loginButton"]');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(0);
    });

    test('given username is missing, when login-button is pressed, then alert is raised', () => {
        loginComponent.setState({
            page: 'Login',
            username: '',
            password: 'bar',
            email: 'foo@bar.com',
        });

        const render = loginComponent.dive();
        const loginButton = render.find('[id="loginButton"]');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(1);
    });

    test('given email is missing, when sign-up-button is pressed, then alert is raised', () => {
        loginComponent.setState({
            page: 'Sign up',
            username: 'foo',
            password: 'bar',
            email: '',
        });

        const render = loginComponent.dive();
        const loginButton = render.find('[id="loginButton"]');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(1);
    });

    test.skip('given user exists, when registering with existing creds, alert is raised', () => {
        fetch.mockResponseSuccess(userExistsRegisteringResponse);

        loginComponent.setState({
            page: 'Sign up',
            username: 'foo',
            password: 'bar',
            email: 'foobar',
        });

        const render = loginComponent.dive();
        const loginButton = render.find('[id="loginButton"]');

        loginButton.simulate('Press');
        // return new Promise(() => {
        //     loginButton.simulate('Press');
        // })
        //     .then(expect(Alert.alert.mock.calls.length).toBe(0));
    });

    test('given email is missing, when login-button is pressed, then alert is not raised', async () => {
        fetch.mockResponseSuccess(successfulLoginResponse);

        loginComponent.setState({
            page: 'Login',
            username: 'foo',
            password: 'bar',
            email: '',
        });
        const render = loginComponent.dive();

        const loginButton = render.find('[id="loginButton"]');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(0);
    });

    test('given all details are missing, when login-button is pressed, then alert is raised', () => {
        loginComponent.setState({
            page: 'Login',
            username: '',
            password: '',
            email: '',
        });
        const render = loginComponent.dive();

        const loginButton = render.find('[id="loginButton"]');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(1);
    });

    test('Given current page is login, when page title is requested, then title is Sign up', () => {
        loginComponent.setState({
            page: 'Login',
            username: '',
            password: '',
            email: '',
        });

        const render = loginComponent.dive();
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

        const render = loginComponent.dive();
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

        const render = loginComponent.dive();
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

        const render = loginComponent.dive();
        const button = render.find('[id="helperText"]');
        expect(button.props().children).toBe(registerText);
    });

    test('renders sign up details when state is sign up', () => {
        const loginComponent = renderer.create(<Login />);
        expect(loginComponent.getInstance().state.page).toEqual('Login');

        loginComponent.getInstance().togglePage();
        expect(loginComponent.getInstance().state.page).toEqual('Sign up');

        const tree = loginComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('Logo is hidden when keyboard is visible', () => {
        const loginComponent = renderer.create(<Login />);
        loginComponent.getInstance().keyboardDidShow();

        expect(loginComponent.getInstance().state.isKeyboardVisible).toBeTruthy();

        const tree = loginComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('handles button press correctly, when hitting login button', () => {
        const render = loginComponent.dive();

        const handleButtonPressSpy = sinon.spy(Login.prototype, 'handleButtonPress');

        const loginButton = render.find('[id="loginButton"]');
        loginButton.simulate('Press');

        expect(handleButtonPressSpy.calledOnce).toBeTruthy();
    });

    test('handles button press correctly, when hitting SignUp/Login Text', () => {
        const render = loginComponent.dive();

        const togglePageSpy = sinon.spy(Login.prototype, 'togglePage');

        render.find('Text').forEach((child) => {
            child.simulate('Press');
        });

        expect(togglePageSpy.calledOnce).toBeTruthy();
    });

    test('isKeyboardVisible is set to false when keyboard is hidden', () => {
        expect(loginComponent.state('isKeyboardVisible')).toBeFalsy();

        loginComponent.setState({ isKeyboardVisible: true });
        loginComponent.instance().keyboardDidHide();

        expect(loginComponent.state('isKeyboardVisible')).toBeFalsy();
    });
});
