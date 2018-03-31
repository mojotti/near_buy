import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import 'isomorphic-fetch'; // for headers, fetch, etc.

import Login from '../src/components/login/Login';
import { UserItems } from '../src/components/user_items/UserItems';
import { sample } from '../src/static/samples/ItemSample';

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

  test('user_items renders without crashing', () => {
    fetch.mockResponseSuccess(sample);

    const rendered = renderer.create(<UserItems />).toJSON();
    expect(rendered).toBeTruthy();
  });

  test('user_items renders correctly', () => {
    fetch.mockResponseSuccess(sample);

    const tree = renderer.create(<UserItems />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
