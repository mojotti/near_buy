import React from 'react';
import { shallow } from 'enzyme';
import ChatButton from '../../../src/components/item_explorer/ChatButton';


describe('<ChatButton />', () => {
  test('reacts to button press', () => {
    const press = jest.fn();
    expect(press.mock.calls.length).toEqual(0);

    const wrapper = shallow(<ChatButton onPress={press} />);

    const chatButton = wrapper.find('TouchableOpacity');
    chatButton.simulate('Press');

    expect(press.mock.calls.length).toEqual(1);
  });
});
