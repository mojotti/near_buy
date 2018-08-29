import React from 'react';
import { shallow } from 'enzyme';
import { _MyChats } from '../../../src/components/chats/MyChats';

const HEADERS = [{
  seller_id: 0,
  buyer_id: 1,
  title: 'foo',
  id: 0,
}];

describe('<_MyChats />', () => {
  test('shows placeholder when no items', () => {
    const wrapper = shallow(
      <_MyChats
        isFetching={false}
        token="foo"
        chatHeaders={[]}
        dispatch={() => {}}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  test('shows items when there are items', () => {
    const wrapper = shallow(
      <_MyChats
        isFetching={false}
        token="foo"
        chatHeaders={HEADERS}
        dispatch={() => {}}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });

  test('update calls correct actions', async () => {
    fetch.mockResponseSuccess(HEADERS);
    const dispatch = jest.fn();

    const wrapper = shallow(
      <_MyChats
        isFetching={false}
        token="foo"
        chatHeaders={HEADERS}
        dispatch={dispatch}
      />
    );

    await wrapper.instance()._updateChats();
    expect(dispatch.mock.calls).toMatchSnapshot();
  });

  test('renders navigation options correctly', () => {
    const navigation = {
      navigate: () => {}
    };
    expect(_MyChats.navigationOptions({ navigation })).toMatchSnapshot();
  });
});
