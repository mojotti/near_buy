import { localhost } from '../static/constants';

const base64 = require('base-64');

const registeringHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const getBearerHeaders = token => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  return headers;
};

export const getFormDataHeaders = token => ({
  Authorization: `Bearer ${token}`,
  'Content-Type': 'multipart/form-data',
});

export const getApplicationJsonHeaders = token => {
  const headers = new Headers();
  headers.append('Authorization', `Bearer ${token}`);
  headers.append('Content-Type', 'application/json');
  return headers;
};

export const getNumOfPictures = (itemId, token) => {
  const url = `http://${localhost}:5000/api/v1.0/${itemId}/num_of_images`;
  return fetch(url, {
    method: 'GET',
    headers: getBearerHeaders(token),
  })
    .then(response => response.json())
    .then(responseJson => {
      return responseJson.num_of_images;
    })
    .catch(error => {
      console.error(error);
      return 0;
    });
};

const generateHash = (username, password) => {
  const credentials = `${username}:${password}`;
  return base64.encode(credentials);
};

const generateHeadersForBasicAuth = (username, password) => {
  const headers = new Headers();
  const hash = generateHash(username, password);
  headers.append('Authorization', `Basic ${hash}`);
  return headers;
};

const generateHashForRegistering = (username, password, email) => {
  const credentials = `${username}:${email}:${password}`;
  return base64.encode(credentials);
};

const getHeadersForRegistering = () => registeringHeaders;

export {
  generateHeadersForBasicAuth,
  generateHash,
  generateHashForRegistering,
  getHeadersForRegistering,
};
