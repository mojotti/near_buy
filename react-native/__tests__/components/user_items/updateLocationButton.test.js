import React from 'react';
import { shallow } from 'enzyme';

import UpdateLocationButton from '../../../src/components/user_items/UpdateLocationButton';

describe('<UpdateLocationButton />', () => {
  test('updates location on press', () => {
    const updateSpy = jest.fn();
    const updateLocationButton = shallow(
      <UpdateLocationButton updateLocation={updateSpy} />
    );

    updateLocationButton.find('TouchableHighlight').simulate('Press');
    expect(updateSpy.mock.calls.length).toEqual(1);
  });
});
