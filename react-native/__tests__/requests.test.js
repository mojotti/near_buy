'use strict';

const base64 = require('base-64');

import { generateHeadersForBasicAuth,
        generateHash } from '../src/request';
import "isomorphic-fetch";  // for headers, fetch, etc.

const username = "testing";
const password = "test_pw";
const expectedHash = base64.encode(username + ':' + password);


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
