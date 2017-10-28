import React from 'react';
import renderer from 'react-test-renderer';

import { ListViewItem } from '../components/ListViewItem';
import { mockedListViewItem } from '../src/static/samples/mockedListViewItem';


describe('ListViewItem', () => {
    test('renders and shows current details', () => {
        const rendered = renderer
            .create(<ListViewItem item={mockedListViewItem} />)
            .toJSON();
        expect(rendered).toBeTruthy();
        expect(rendered).toMatchSnapshot();
    });
});
