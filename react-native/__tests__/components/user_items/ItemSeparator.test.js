import React from 'react';
import { shallow } from 'enzyme';

import ItemSeparator from '../../../src/components/user_items/ItemSeparator';

describe('<ItemSeparator />', () => {
  test('renders correctly', () => {
    expect(shallow(<ItemSeparator />)).toMatchSnapshot();
  });
});
