import React from 'react';
import { Alert } from 'react-native';
import { shallow } from 'enzyme';
import DeleteButton from '../../../src/components/user_items/DeleteButton';

describe('<DeleteButton />', () => {
  test('renders correctly', () => {
    const deleteButton = shallow(
      <DeleteButton
        id={1}
        token={'foo'}
        fetchItems={() => {}}
        navigation={{ goBack: jest.fn(() => {}) }}
      />
    );
    expect(deleteButton).toMatchSnapshot();
  });

  test('removes item on button press', async () => {
    fetch.mockResponseSuccess({ ok: true });
    const fetchItemsSpy = jest.fn();
    const goBackSpy = jest.fn();

    const deleteButton = shallow(
      <DeleteButton
        id={1}
        token={'foo'}
        fetchItems={fetchItemsSpy}
        navigation={{ goBack: goBackSpy }}
      />
    );

    // to resolve both of the promises
    await await deleteButton.simulate('Press');

    expect(fetchItemsSpy.mock.calls.length).toEqual(1);
    expect(goBackSpy.mock.calls.length).toEqual(1);
  });

  test('raises alert on error', async () => {
    fetch.mockResponseFailure('error');
    Alert.alert = jest.fn();

    const deleteButton = shallow(
      <DeleteButton
        id={1}
        token={'foo'}
        fetchItems={() => {}}
        navigation={{ goBack: () => {} }}
      />
    );

    await await await deleteButton.simulate('Press');

    expect(Alert.alert.mock.calls).toEqual([
      [
        'Oopsie Woopsie!',
        'Something went wrong, please check your network connection & try again!',
      ],
    ]);
  });
});
