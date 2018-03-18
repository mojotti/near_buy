import 'isomorphic-fetch';
import 'react-native-fetch-blob';
const realFetch = require('node-fetch');

global.fetch = jest.fn();
global.Headers = realFetch.Headers;

fetch.mockResponseSuccess = body => {
  fetch.mockImplementationOnce(() =>
    Promise.resolve({ json: () => Promise.resolve(body) }),
  );
};

fetch.mockResponseFailure = error => {
  fetch.mockImplementationOnce(() => Promise.reject(error));
};

jest.mock('react-native-fetch-blob', () => {
  return {
    DocumentDir: () => {},
    polyfill: () => {},
    fetch: () => Promise.resolve({ json: () => Promise.resolve('success') }),
    wrap: () => '12345',
  };
});

function FormDataMock() {
  this.append = jest.fn();
}
global.FormData = FormDataMock;
