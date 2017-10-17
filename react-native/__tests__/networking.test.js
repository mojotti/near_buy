'use strict';

const base64 = require('base-64');

import { generateHeadersForBasicAuth,
    generateHash,
    generateHashForRegistering } from '../src/networking';
import "isomorphic-fetch";  // for headers, fetch, etc.

const username = "testing";
const password = "test_pw";
const email = "test_email";
const expectedHash = base64.encode(username + ':' + password);
const expectedHashForEmail = base64.encode(username + ':' + email + ':' + password);

it('givenUsernameAndPwAreKnownWhenHashIsGeneratedThenItIsExpected', () => {
    expect(expectedHash).toEqual(generateHash(username, password));
});

it('givenUsernameAndPwAreNotKnownWhenHashIsGeneratedThenItIsExpected', () => {
    expect(expectedHash).not.toEqual(generateHash("mojo", "passu"));
});

it('givenUsernameAndPwAreKnownWhenHeadersForBasicAuthIsGeneratedThenItIsExpected', () => {
    let headers = new Headers();
    headers.append("Authorization", "Basic " + expectedHash);
    expect(headers).toEqual(generateHeadersForBasicAuth(username, password));
});

it('givenUsernameAndPwIsNotKnownWhenHeadersForBasicAuthIsGeneratedThenItIsExpected', () => {
    let headers = new Headers();
    headers.append("Authorization", "Basic " + expectedHash);
    expect(headers).not.toEqual(generateHeadersForBasicAuth("random", "enmuista"));
});

it('givenUsernameEmailAndPwAreKnowWhenHashIsGeneratedThenItIsExpected', () => {
    expect(expectedHashForEmail).toEqual(generateHashForRegistering(username, password, email));
});

it('givenUsernameEmailAndPwAreNotKnownWhenHashIsGeneratedThenItIsExpected', () => {
    expect(expectedHashForEmail).not.toEqual(generateHashForRegistering("jee", "juu", "ee"));
});
