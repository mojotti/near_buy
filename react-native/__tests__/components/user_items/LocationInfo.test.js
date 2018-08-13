import React from 'react';
import { shallow } from 'enzyme';
import LocationInfoText from '../../../src/components/user_items/LocationInfoText';

describe('<LocationInfoText />', () => {
  test('renders correctly', () => {
    expect(shallow(<LocationInfoText />)).toMatchSnapshot();
  });
});
