import React from 'react';
import configureStore from 'redux-mock-store';
import 'isomorphic-fetch'; // for headers, fetch, etc.
import renderer from 'react-test-renderer';

import Login from '../src/components/login/Login';

const middlewares = [];
const mockStore = configureStore(middlewares);
const initialState = {
  authorizationReducer: {
    isLoggedIn: false,
    username: '',
    token: '',
  },
};
const store = mockStore(initialState);

describe('Render', () => {
  test('Login renders without crashing', () => {
    const rendered = renderer.create(<Login store={store} />).toJSON();
    expect(rendered).toBeTruthy();
  });

  test('Login renders correctly', () => {
    const tree = renderer.create(<Login store={store} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
