import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import 'isomorphic-fetch'; // for headers, fetch, etc.

import Login from '../components/Login';
import { Items } from '../components/Items';

const middlewares = [];
const mockStore = configureStore(middlewares);
const initialState = {
    auth: {
        isLoggedIn: false,
        username: '',
        token: '',
    },
};
const store = mockStore(initialState);

it('Login renders without crashing', () => {
    const rendered = renderer
        .create(<Login store={store} />)
        .toJSON();
    expect(rendered).toBeTruthy();
});

it('Login renders correctly', () => {
    const tree = renderer
        .create(<Login store={store} />)
        .toJSON();
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

