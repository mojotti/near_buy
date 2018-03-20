import React from 'react';
import renderer from 'react-test-renderer';

import { ListViewItem } from '../../../src/components/user_items/ListViewItem';
import { mockedListViewItem } from '../../../src/static/samples/mockedListViewItem';

describe('ListViewItem', () => {
  test('renders and shows current details', () => {
    const rendered = renderer
      .create(<ListViewItem item={mockedListViewItem} />)
      .toJSON();
    expect(rendered).toBeTruthy();
    expect(rendered).toMatchSnapshot();
  });
});
