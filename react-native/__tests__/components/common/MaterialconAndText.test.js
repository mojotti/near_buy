import React from 'react';
import { shallow } from 'enzyme';
import MaterialIconAndText from '../../../src/components/common/MaterialIconAndText';


describe('<MaterialIconAndText />', () => {
  test('renders correctly', () => {
    const wrapper = shallow(
      <MaterialIconAndText
        iconName={'access-point'}
        headerText={'this is header'}
        containerText={'and this just context'}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
