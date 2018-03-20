import React from 'react';
import 'isomorphic-fetch'; // for headers, fetch, etc.
import renderer from 'react-test-renderer';

import { UserItems } from '../../../src/components/user_items/UserItems';
import { sample } from '../../../src/static/samples/ItemSample';

describe('UserItems', () => {
  it('render correctly when response has user_items', () => {
    fetch.mockResponseSuccess(sample);

    const items = renderer.create(<UserItems />);
    items.getInstance().handleAllItemsRequest(sample);

    expect(items.toJSON()).toMatchSnapshot();
  });
});
