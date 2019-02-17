import React from 'react';
import { Alert } from 'react-native';
import { shallow } from 'enzyme';
import { _SaveButton } from '../../../src/components/user_items/SaveButton';

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

const MOCKED_LOCATION = {
  location: {
    longitude: 240.53,
    latitude: 24.42,
  },
};

describe('<_SaveButton />', () => {
  test('renders correctly', () => {
    const saveButton = shallow(
      <_SaveButton
        id={1}
        fetchItems={() => {}}
        navigation={{ goBack: jest.fn(() => {}) }}
        item={MOCKED_ITEM}
        location={MOCKED_LOCATION.location}
      />
    );
    expect(saveButton).toMatchSnapshot();
  });

  test('saves item on button press', async () => {
    fetch.mockResponseSuccess({ ok: true });
    const fetchItemsSpy = jest.fn();
    const goBackSpy = jest.fn();

    const saveButton = shallow(
      <_SaveButton
        id={1}
        item={MOCKED_ITEM}
        fetchItems={fetchItemsSpy}
        navigation={{ goBack: goBackSpy }}
        location={MOCKED_LOCATION.location}
      />
    );

    // to resolve both of the promises
    await await saveButton
      .find('Text')
      .last()
      .simulate('Press');

    expect(fetchItemsSpy.mock.calls.length).toEqual(1);
    expect(goBackSpy.mock.calls.length).toEqual(1);
  });

  test('raises alert on error', async () => {
    fetch.mockResponseFailure('error');
    Alert.alert = jest.fn();

    const saveButton = shallow(
      <_SaveButton
        id={1}
        location={MOCKED_LOCATION.location}
        item={MOCKED_ITEM}
        fetchItems={() => {}}
        navigation={{ goBack: () => {} }}
      />
    );

    await await await saveButton
      .find('Text')
      .last()
      .simulate('Press');

    expect(Alert.alert.mock.calls).toEqual([
      [
        'Oopsie Woopsie!',
        'Something went wrong, please check your network connection & try again!',
      ],
    ]);
  });
});
