import React from 'react';
import 'isomorphic-fetch'; // for headers, fetch, etc.
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { UserItems } from '../../../src/components/user_items/UserItems';

import { sample } from '../../__mocks__/ItemSample';

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

describe('UserItems', () => {
  it.skip('render correctly when response has user_items', () => {
    fetch.mockResponseSuccess(sample);

    const items = renderer.create(<UserItems store={store} />);
    items.getInstance().handleAllItemsResponse(sample);

    expect(items.toJSON()).toMatchSnapshot();
  });
});
