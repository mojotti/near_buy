import React from 'react';
import { Alert } from 'react-native';
import { shallow } from 'enzyme';
import { _UserItem } from '../../../src/components/user_items/UserItem';

const MOCKED_ITEM = {
  id: 1,
  title: 'foo',
  description: 'bar',
  price: 100,
  created: 1032042024,
  imageUrls: [],
  longitude: 240.53,
  latitude: 24.42,
};

describe('<_UserItem />', () => {
  test('renders correctly', () => {
    const userItem = shallow(
      <_UserItem item={MOCKED_ITEM} fetchItems={() => {}} />
    );

    expect(userItem).toMatchSnapshot();
  });

  test('navigates to item on press', () => {
    const naviSpy = jest.fn();

    const mockedNavi = {
      navigate: naviSpy,
    };
    const userItem = shallow(
      <_UserItem
        item={MOCKED_ITEM}
        fetchItems={() => {}}
        navigation={mockedNavi}
      />
    );

    expect(naviSpy.mock.calls.length).toEqual(0);

    userItem
      .find('Swipeout')
      .find('TouchableOpacity')
      .simulate('Press');

    expect(naviSpy.mock.calls.length).toEqual(1);
  });

  test('removes item', async () => {
    fetch.mockResponseSuccess({ ok: true });
    const fetchSpy = jest.fn();

    const userItem = shallow(
      <_UserItem
        item={MOCKED_ITEM}
        fetchItems={fetchSpy}
        navigation={() => {}}
        token="foo_token"
      />
    );

    await await userItem.instance()._removeItem();

    expect(fetchSpy.mock.calls.length).toEqual(1);
  });

  test('fails to remove item', async () => {
    Alert.alert = jest.fn();
    fetch.mockResponseFailure('failed to remove item');

    const userItem = shallow(
      <_UserItem
        item={MOCKED_ITEM}
        fetchItems={() => {}}
        navigation={() => {}}
        token="foo_token"
      />
    );

    await await await userItem.instance()._removeItem();

    const expectedError = [
      [
        'Oopsie Woopsie!',
        'Something went wrong, please check your network connection & try again!',
      ],
    ];
    expect(Alert.alert.mock.calls.length).toEqual(1);
    expect(Alert.alert.mock.calls).toEqual(expectedError);
  });
});
