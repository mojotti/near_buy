import React from 'react';
import { Login } from '../components/Login';
import "isomorphic-fetch";  // for headers, fetch, etc.

const state = {
    page: 'Login',
    username: 'foo',
    password: 'bar',
    email: 'foo@bar.com'
};

describe('Login', () => {
    let login;

    beforeEach(() => {
        login = new Login();
        login.handleLoginRequest = jest.genMockFunction();
        login.handleRegisteringRequest = jest.genMockFunction();
    });

    it('Given page is Login, when handleButtonPress is called, then handleLoginRequest is called once', () => {
        login.handleButtonPress(state);
        expect(login.handleLoginRequest.mock.calls.length).toBe(1);
        expect(login.handleRegisteringRequest.mock.calls.length).toBe(0);
    });

    it('Given page is register, when handleButtonPress is called, then handleRegisteringRequest is called once', () => {
        state.page = 'register';
        login.handleRegisteringRequest(state);
        expect(login.handleRegisteringRequest.mock.calls.length).toBe(1);
        expect(login.handleLoginRequest.mock.calls.length).toBe(0);
    });
});