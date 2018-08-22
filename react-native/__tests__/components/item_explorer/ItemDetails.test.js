import React from 'react';
import { shallow } from 'enzyme';
import { _ItemDetails } from '../../../src/components/item_explorer/ItemDetails';

const PROPS = {
  item: {
    title: 'foo',
    description: 'bar',
  },
  navigation: {
    state: {
      params: {
        item: {
          title: 'foo'
        }
      }
    }
  },
  token: 'fake token',
  distance: '2 km',
};
describe('<_ItemDetails />', () => {
  test('renders correctly', () => {
    fetch.mockResponseSuccess({ numOfImages: 2 });

    const wrapper = shallow(<_ItemDetails {...PROPS} />);
    expect(wrapper).toMatchSnapshot();
  });
});
