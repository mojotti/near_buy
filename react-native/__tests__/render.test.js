import React from 'react';
import renderer from 'react-test-renderer';
import 'isomorphic-fetch'; // for headers, fetch, etc.

import { Login } from '../components/Login';
import { Items } from '../components/Items';


it('Login renders without crashing', () => {
    const rendered = renderer.create(<Login />).toJSON();
    expect(rendered).toBeTruthy();
});

it('Login renders correctly', () => {
    const tree = renderer.create(<Login />).toJSON();
    expect(tree).toMatchSnapshot();
});


it('Items renders without crashing', () => {
    const rendered = renderer.create(<Items />).toJSON();
    expect(rendered).toBeTruthy();
});

it('Items renders correctly', () => {
    const tree = renderer.create(<Items />).toJSON();
    expect(tree).toMatchSnapshot();
});
