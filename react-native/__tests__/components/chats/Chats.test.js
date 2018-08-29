import React from 'react';
import { shallow } from 'enzyme';
import Chat from '../../../src/components/chats/Chat';

const navigation = {
  state: {
    params: {
      item: {
        seller_id: 0,
        buyer_id: 0,
        id: 0,
      }
    }
  }
};

describe('<Chat />', () => {
  test('renders correctly', () => {
    const wrapper = shallow(<Chat navigation={navigation} />);
    expect(wrapper).toMatchSnapshot();
  });
});
