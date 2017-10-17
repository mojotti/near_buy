import React from 'react';
import { Alert } from 'react-native';
import { Login } from '../components/Login';
import "isomorphic-fetch";  // for headers, fetch, etc.


describe('Login', () => {
    let state = {};
    let login;

    beforeEach(() => {
        state = {
            page: 'Login',
            username: 'foo',
            password: 'bar',
            email: 'foo@bar.com'
        };
        login = new Login();
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
});