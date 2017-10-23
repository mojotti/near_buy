import React from 'react';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch'; // for headers, fetch, etc.

import { Alert, Text } from 'react-native';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Login } from '../components/Login';
import {
    loginText,
    registerText } from '../src/static/constants';


describe('Login', () => {
    let login;
    let wrapper;

    beforeEach(() => {
        login = renderer.create(<Login />).getInstance();
        Alert.alert = jest.genMockFunction();
        wrapper = shallow(<Login />);
    });

    test('given state is login, when login-button is pressed, then alert is not raised', () => {
        wrapper.setState({
            page: 'Login',
            username: 'foo',
            password: 'bar',
            email: 'foo@bar.com',
        });

        const render = wrapper.dive();
        const loginButton = render.find('Button');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(0);
    });

    test('given state is sign-up, when sign-up-button is pressed, then alert is not raised', () => {
        wrapper.setState({
            page: 'Sign up',
            username: 'foo',
            password: 'bar',
            email: 'foo@bar.com',
        });

        const render = wrapper.dive();
        const loginButton = render.find('Button');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(0);
    });

    test('given username is missing, when login-button is pressed, then alert is raised', () => {
        wrapper.setState({
            page: 'Login',
            username: '',
            password: 'bar',
            email: 'foo@bar.com',
        });

        const render = wrapper.dive();
        const loginButton = render.find('Button');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(1);
    });

    test('given email is missing,, when sign-up-button is pressed, then alert is raised', () => {
        wrapper.setState({
            page: 'Sign up',
            username: 'foo',
            password: 'bar',
            email: '',
        });

        const render = wrapper.dive();
        const loginButton = render.find('Button');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(1);
    });

    test('given email is missing, when login-button is pressed, then alert is not raised', () => {
        wrapper.setState({
            page: 'Login',
            username: 'foo',
            password: 'bar',
            email: '',
        });
        const render = wrapper.dive();

        const loginButton = render.find('Button');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(0);
    });

    test('given all details are missing, when login-button is pressed, then alert is raised', () => {
        wrapper.setState({
            page: 'Login',
            username: '',
            password: '',
            email: '',
        });
        const render = wrapper.dive();

        const loginButton = render.find('Button');
        loginButton.simulate('Press');

        expect(Alert.alert.mock.calls.length).toBe(1);
    });

    test('Given current page is login, when page title is requested, then title is Sign up', () => {
        wrapper.setState({
            page: 'Login',
            username: '',
            password: '',
            email: '',
        });

        const render = wrapper.dive();
        const button = render.find('[id="altPageTitle"]');
        expect(button.props().children).toBe('Sign up');
    });

    test('Given current page is sign up, when page title is requested, then title is Login', () => {
        wrapper.setState({
            page: 'Sign up',
            username: '',
            password: '',
            email: '',
        });

        const render = wrapper.dive();
        const button = render.find('[id="altPageTitle"]');
        expect(button.props().children).toBe('Login');
    });

    test('Given current page is login, when helper text is requested, then test is login helper', () => {
        const helperText = login.getHelperText();
        expect(helperText).toBe(loginText);
    });

    test('Given current page is sign up, when helper text is requested, then test is sign up helper', () => {
        login.state.page = 'Sign up';
        const helperText = login.getHelperText();
        expect(helperText).toBe(registerText);
    });

    test('renders sign up details when state is sign up', () => {
        const loginComponent = renderer.create(<Login />);
        expect(loginComponent.getInstance().state.page).toEqual('Login');

        loginComponent.getInstance().togglePage();
        expect(loginComponent.getInstance().state.page).toEqual('Sign up');

        const tree = loginComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('hides logo and welcome text when text is focused', () => {
        const loginComponent = renderer.create(<Login />);
        expect(loginComponent.getInstance().state.textFocused).toEqual(false);

        loginComponent.getInstance().setState({ textFocused: true });
        const tree = loginComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    test('handles button press correctly, when hitting login button', () => {
        const render = wrapper.dive();

        const handleButtonPressSpy = sinon.spy(Login.prototype, 'handleButtonPress');

        const loginButton = render.find('Button');
        loginButton.simulate('Press');

        expect(handleButtonPressSpy.calledOnce).toBeTruthy();
    });

    test('handles button press correctly, when hitting SignUp/Login Text', () => {
        const render = wrapper.dive();

        const togglePageSpy = sinon.spy(Login.prototype, 'togglePage');

        render.find('Text').forEach((child) => {
            child.simulate('Press');
        });

        expect(togglePageSpy.calledOnce).toBeTruthy();
    });

    test('handles textInput press correctly and sets textFocused to true', () => {
        expect(wrapper.state('textFocused')).toBeFalsy();

        const render = wrapper.dive();
        render.find('TextInput').forEach((child) => {
            child.simulate('Focus');
        });

        expect(wrapper.state('textFocused')).toBeTruthy();
    });
});
