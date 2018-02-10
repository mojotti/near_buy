const base64 = require('base-64');


function generateHash(username, password) {
    const credentials = `${username}:${password}`;
    return base64.encode(credentials);
}

function generateHeadersForBasicAuth(username, password) {
    const headers = new Headers();
    const hash = generateHash(username, password);
    headers.append('Authorization', `Basic ${hash}`);
    return headers;
}

function generateHashForRegistering(username, password, email) {
    const credentials = `${username}:${email}:${password}`;
    return base64.encode(credentials);
}


export {
    generateHeadersForBasicAuth,
    generateHash,
    generateHashForRegistering
};
