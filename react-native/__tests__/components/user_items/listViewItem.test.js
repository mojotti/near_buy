import React from 'react';
import { shallow } from 'enzyme';

import { _UserItem } from '../../../src/components/user_items/UserItem';
import { mockedListViewItem } from '../../../src/static/samples/mockedListViewItem';

describe('_UserItem', () => {
  test('renders and shows current details', () => {
    const rendered = shallow(<_UserItem item={mockedListViewItem} />);
    expect(rendered).toMatchSnapshot();
  });
});
