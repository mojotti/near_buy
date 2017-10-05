'use strict';

const base64 = require('base-64');


function generateHash(username, password) {
  const credentials = username + ':' + password;
  return base64.encode(credentials);
}

function generateHeadersForBasicAuth(username, password) {
  var headers = new Headers();
  var hash = generateHash(username, password);
  headers.append("Authorization", "Basic " + hash);
  return headers;
}

function generateHashForLogin(username, password, email) {
  const credentials = username + ':' + password + ':' + email;
  return base64.encode(credentials);
}


export { generateHeadersForBasicAuth,
        generateHash,
        generateHashForLogin };