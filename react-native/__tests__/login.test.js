import React from 'react';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch'; // for headers, fetch, etc.

import { Alert } from 'react-native';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Login } from '../components/Login';
import {
    loginText,
    registerText } from '../src/static/constants';


describe('Login', () => {
    let state = {};
    let login;

    beforeEach(() => {
        state = {
            page: 'Login',
            username: 'foo',
            password: 'bar',
            email: 'foo@bar.com',
        };
        login = renderer.create(
            <Login />,
        ).getInstance();
        login.handleLoginRequest = jest.genMockFunction();
        login.handleRegisteringRequest = jest.genMockFunction();
        Alert.alert = jest.genMockFunction();
    });

    it('Given page is Login, when handleButtonPress is called, then handleLoginRequest is called once', () => {
        login.handleButtonPress(state);
        expect(login.handleLoginRequest.mock.calls.length).toBe(1);
        expect(login.handleRegisteringRequest.mock.calls.length).toBe(0);
        expect(Alert.alert.mock.calls.length).toBe(0);
    });

    it('Given page is sign up, when handleButtonPress is called, then handleRegisteringRequest is called once', () => {
        state.page = 'Sign up';
        login.handleButtonPress(state);
        expect(login.handleRegisteringRequest.mock.calls.length).toBe(1);
        expect(login.handleLoginRequest.mock.calls.length).toBe(0);
        expect(Alert.alert.mock.calls.length).toBe(0);
    });

    it('Given username is missing, when handleButtonPress is called, then alert is raised', () => {
        state.username = '';
        login.handleButtonPress(state);
        expect(Alert.alert.mock.calls.length).toBe(1);
        expect(login.handleRegisteringRequest.mock.calls.length).toBe(0);
        expect(login.handleLoginRequest.mock.calls.length).toBe(0);
    });

    it('Given emails is missing and page is sign up, when handleButtonPress is called, then alert is raised', () => {
        state.email = '';
        state.page = 'Sign up';
        login.handleButtonPress(state);
        expect(Alert.alert.mock.calls.length).toBe(1);
    });

    it('Given email is missing and page is login, when handleButtonPress is called, then alert is not raised', () => {
        state.email = '';
        login.handleButtonPress(state);
        expect(Alert.alert.mock.calls.length).toBe(0);
    });

    it('Given current page is login, when page title is requested, then title is Sign up', () => {
        const altPageTitle = login.getAlternativePageTitle(state);
        expect(altPageTitle).toBe('Sign up');
    });

    it('Given current page is sign up, when page title is requested, then title is Login', () => {
        login.state.page = 'Sign up';
        const altPageTitle = login.getAlternativePageTitle();
        expect(altPageTitle).toBe('Login');
    });

    it('Given current page is login, when helper text is requested, then it is login helper', () => {
        const helperText = login.getHelperText(state);
        expect(helperText).toBe(loginText);
    });

    it('Given current page is sign up, when helper text is requested, then it is sign up helper', () => {
        login.state.page = 'Sign up';
        const helperText = login.getHelperText(state);
        expect(helperText).toBe(registerText);
    });

    it('renders sign up details when state is sign up', () => {
        const loginComponent = renderer.create(<Login />);
        expect(loginComponent.getInstance().state.page).toEqual('Login');
        loginComponent.getInstance().togglePage();
        expect(loginComponent.getInstance().state.page).toEqual('Sign up');
        const tree = loginComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('hides logo and welcome text when text is focused', () => {
        const loginComponent = renderer.create(<Login />);
        expect(loginComponent.getInstance().state.textFocused).toEqual(false);
        loginComponent.getInstance().setState({ textFocused: true });
        const tree = loginComponent.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('handles button press correctly, when hitting login button', () => {
        const wrapper = shallow(<Login />);
        const render = wrapper.dive();

        const handleButtonPressSpy = sinon.spy(Login.prototype, 'handleButtonPress');

        render.find('Button').forEach((child) => {
            child.simulate('Press');
        });

        expect(handleButtonPressSpy.calledOnce).toBeTruthy();
    });
});
