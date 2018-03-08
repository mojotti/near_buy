import React from 'react';
import renderer from 'react-test-renderer';

import { NewItem } from '../../../components/new_item/NewItem';

describe('New Item', () => {
  it('renders correctly', () => {
    const newItem = renderer.create(<NewItem />);

    expect(newItem.toJSON()).toMatchSnapshot();
  });
});
