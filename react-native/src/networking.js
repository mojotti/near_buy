const base64 = require('base-64');

const registeringHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
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
