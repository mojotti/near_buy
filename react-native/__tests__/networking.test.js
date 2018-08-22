import 'isomorphic-fetch'; // for headers, fetch, etc.
import {
  generateHeadersForBasicAuth,
  generateHash,
  generateHashForRegistering,
  getFormDataHeaders,
  getBearerHeaders,
  getApplicationJsonHeaders,
  getNumOfPictures,
} from '../src/networking/networking';

const base64 = require('base-64');

const username = 'testing';
const password = 'test_pw';
const email = 'test_email';
const expectedHash = base64.encode(`${username}:${password}`);
const expectedHashForEmail = base64.encode(`${username}:${email}:${password}`);

describe('Networking', () => {
  it('given username and pw are known, when hash is generated, then it is expected', () => {
    expect(expectedHash).toEqual(generateHash(username, password));
  });

  it('given username and pw are unknown, when hash is generated, then it is expected', () => {
    expect(expectedHash).not.toEqual(generateHash('mojo', 'passu'));
  });

  it('given username and pw are known, when header is generated, then it is expected', () => {
    const headers = new Headers();
    headers.append('Authorization', `Basic ${expectedHash}`);
    expect(headers).toEqual(generateHeadersForBasicAuth(username, password));
  });

  it('given username and pw are unknown, when header is generated, then it is expected', () => {
    const headers = new Headers();
    headers.append('Authorization', `Basic ${expectedHash}`);
    expect(headers).not.toEqual(generateHeadersForBasicAuth('foo', 'baz'));
  });

  it('given username and pw are known, when hash is generated, then it is expected', () => {
    expect(expectedHashForEmail).toEqual(
      generateHashForRegistering(username, password, email),
    );
  });

  it('given username and pw are unknown, when hash is generated, then it is expected', () => {
    expect(expectedHashForEmail).not.toEqual(
      generateHashForRegistering('foo', 'bar', 'baz'),
    );
  });

  it('gets bearer headers', () => {
    const token = 'foobar';
    const headers = getBearerHeaders(token);
    const expectedResponse = { _headers: { authorization: ['Bearer foobar'] } };
    expect(headers).toEqual(expectedResponse);
  });

  it('gets application headers', () => {
    const token = 'foobar';
    const headers = getApplicationJsonHeaders(token);
    const expectedResponse = {
      _headers: {
        authorization: ['Bearer foobar'],
        'content-type': ['application/json'],
      },
    };
    expect(headers).toEqual(expectedResponse);
  });

  test('gets num of pictures', () => {
    fetch.mockResponseSuccess({ num_of_images: 1 });

    return getNumOfPictures()
      .then(result => {
        expect(result).toEqual(1);
      });
  });

  test('does not get num of pictures', () => {
    fetch.mockResponseFailure('error');

    return getNumOfPictures()
      .then(result => {
        expect(result).toEqual(0);
      });
  });

});
