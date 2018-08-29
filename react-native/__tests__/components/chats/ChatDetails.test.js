import React from 'react';
import { shallow } from 'enzyme';
import { _ChatDetails } from '../../../src/components/chats/ChatDetails';

const item = {
  item: {
    id: 1,
    title: 'foo',
    seller_id: 0,
    buyer_id: 0,
  }
};

describe('<ChatDetails />', () => {
  test('renders correctly', () => {
    const wrapper = shallow(<_ChatDetails item={item} />);
    expect(wrapper).toMatchSnapshot();
  });
});
