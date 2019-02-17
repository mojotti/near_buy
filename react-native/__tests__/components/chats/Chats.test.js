import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';

import _Chat from '../../../src/components/chats/Chat';

const middlewares = [];
const mockStore = configureStore(middlewares);
const initialState = {
  currentChatsReducer: {},
  chatMessagesReducer: {
    chatMessages: [],
  },
  authorizationReducer: {
    token: 'foo',
  },
};
const store = mockStore(initialState);

const navigation = {
  state: {
    params: {
      item: {
        seller_id: 0,
        buyer_id: 0,
        id: 0,
      },
    },
  },
};

describe('<_Chat />', () => {
  test('renders correctly', () => {
    const wrapper = shallow(
      <_Chat
        navigation={navigation}
        store={store}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
