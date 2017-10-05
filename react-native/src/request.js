'use strict';

const base64 = require('base-64');


function generateHash(username, password) {
  var credentials = username + ':' + password;
  return base64.encode(credentials);
}

function generateHeadersForBasicAuth(username, password) {
  var headers = new Headers();
  var hash = generateHash(username, password);
  headers.append("Authorization", "Basic " + hash);
  return headers;
}


export { generateHeadersForBasicAuth, generateHash };
