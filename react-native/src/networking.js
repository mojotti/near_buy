'use strict';

const base64 = require('base-64');


function generateHash(username, password) {
    let credentials = `${username}:${password}`;
    return base64.encode(credentials);
}

function generateHeadersForBasicAuth(username, password) {
    let headers = new Headers();
    let hash = generateHash(username, password);
    headers.append('Authorization', `Basic ${hash}`);
    return headers;
}

function generateHashForRegistering(username, password, email) {
    let credentials = `${username}:${email}:${password}`;
    return base64.encode(credentials);
}


export { generateHeadersForBasicAuth,
    generateHash,
    generateHashForRegistering };
