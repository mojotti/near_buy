import React from 'react';
import 'isomorphic-fetch'; // for headers, fetch, etc.
import renderer from 'react-test-renderer';

import { Items } from '../components/Items';
import { sample } from '../src/static/ItemSample';


describe('Items', () => {
    it('render correctly when response has items', () => {
        fetch.mockResponseSuccess(sample);
        const items = renderer.create(<Items />);
        items.getInstance().handleAllItemsRequest(sample);
        expect(items.toJSON()).toMatchSnapshot();
    });
});
