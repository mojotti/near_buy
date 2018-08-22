import React from 'react';
import { shallow } from 'enzyme';
import ItemDetailsImageCarousel
  from '../../../src/components/item_explorer/ItemDetailsImageCarousel';


describe('<ItemDetailsImageCarousel />', () => {
  test('renders carousel when it should', () => {
    const wrapper =
      shallow(<ItemDetailsImageCarousel images={['foo.png', 'bar.png']} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('renders image when it should', () => {
    const wrapper =
      shallow(<ItemDetailsImageCarousel images={['foo.png']} />);

    expect(wrapper).toMatchSnapshot();
  });
});
