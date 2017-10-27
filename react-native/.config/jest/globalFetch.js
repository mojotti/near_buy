import 'isomorphic-fetch';
const realFetch = require('node-fetch');

global.fetch = jest.fn();
global.Headers = realFetch.Headers;

fetch.mockResponseSuccess = (body) => {
    fetch.mockImplementationOnce(
        () => Promise.resolve({ json: () => Promise.resolve(body) }));
};

fetch.mockResponseFailure = (error) => {
    fetch.mockImplementationOnce(() => Promise.reject(error));
};
