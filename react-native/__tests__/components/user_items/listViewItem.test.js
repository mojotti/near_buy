import React from 'react';
import renderer from 'react-test-renderer';

import { UserItem } from '../../../src/components/user_items/UserItem';
import { mockedListViewItem } from '../../../src/static/samples/mockedListViewItem';

describe('UserItem', () => {
  test('renders and shows current details', () => {
    const rendered = renderer
      .create(<UserItem item={mockedListViewItem} />)
      .toJSON();
    expect(rendered).toBeTruthy();
    expect(rendered).toMatchSnapshot();
  });
});
