'use strict';

const base64 = require('base-64');

import { generateHeadersForBasicAuth,
        generateHash,
        generateHashForLogin } from '../src/request';
import "isomorphic-fetch";  // for headers, fetch, etc.

const username = "testing";
const password = "test_pw";
const email = "test_email";
const expectedHash = base64.encode(username + ':' + password);
const expectedHashForEmail = base64.encode(username + ':' + password + ':' + email);

it('givenUsernameAndPwAreKnownWhenHashIsGeneratedThenItIsExpected', () => {
  expect(expectedHash).toEqual(generateHash(username, password));
});

it('givenUsernameAndPwAreNotKnownWhenHashIsGeneratedThenItIsExpected', () => {
  expect(expectedHash).not.toEqual(generateHash("mojo", "passu"));
});

it('givenUsernameAndPwAreKnownWhenHeadersForBasicAuthIsGeneratedThenItIsExpected', () => {
  var headers = new Headers();
  headers.append("Authorization", "Basic " + expectedHash);
  expect(headers).toEqual(generateHeadersForBasicAuth(username, password));
});

it('givenUsernameAndPwIsNotKnownWhenHeadersForBasicAuthIsGeneratedThenItIsExpected', () => {
  var headers = new Headers();
  headers.append("Authorization", "Basic " + expectedHash);
  expect(headers).not.toEqual(generateHeadersForBasicAuth("random", "enmuista"));
});

it('givenUsernameEmailAndPwAreKnowWhenHashIsGeneratedThenItIsExpected', () => {
  expect(expectedHashForEmail).toEqual(generateHashForLogin(username, password, email));
});

it('givenUsernameEmailAndPwAreNotKnownWhenHashIsGeneratedThenItIsExpected', () => {
  expect(expectedHashForEmail).not.toEqual(generateHashForLogin("jee", "juu", "ee"));
});
