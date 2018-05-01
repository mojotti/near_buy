import React from 'react';
import renderer from 'react-test-renderer';

import { _UserItem } from '../../../src/components/user_items/UserItem';
import { mockedListViewItem } from '../../../src/static/samples/mockedListViewItem';

describe('_UserItem', () => {
  test('renders and shows current details', () => {
    const rendered = renderer
      .create(<_UserItem item={mockedListViewItem} />)
      .toJSON();
    expect(rendered).toBeTruthy();
    expect(rendered).toMatchSnapshot();
  });
});
