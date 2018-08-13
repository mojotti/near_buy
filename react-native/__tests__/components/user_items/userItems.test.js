import React from 'react';
import 'isomorphic-fetch'; // for headers, fetch, etc.
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import { _UserItems } from '../../../src/components/user_items/UserItems';

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

describe('<_UserItems />', () => {
  test('renders correctly when response has user_items', () => {
    fetch.mockResponseSuccess(sample);

    const items = shallow(<_UserItems store={store} />);
    items.instance().handleAllItemsResponse(sample);

    expect(items).toMatchSnapshot();
  });

  test('renders correctly when response has no items', () => {
    fetch.mockResponseSuccess({ items: 'no items' });

    const items = shallow(<_UserItems store={store} />);
    items.instance().handleAllItemsResponse({ items: 'no items' });

    expect(items).toMatchSnapshot();
  });

  test('has correct navigation options', () => {
    const params = { navigate: jest.fn() }
    const naviOptions = _UserItems.navigationOptions({ navigation: params });

    expect(naviOptions).toMatchSnapshot();
  });
});
