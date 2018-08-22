import React from 'react';
import configureStore from 'redux-mock-store';
import { shallow } from 'enzyme';
import DrawerMenu from '../../src/components/drawer/DrawerMenu';

const middlewares = [];
const mockStore = configureStore(middlewares);
const initialState = {};
const store = mockStore(initialState);


describe('<DrawerMenu />', () => {
  test('renders correctly', () => {
    const navi = { navigate: () => {} }
    const wrapper = shallow(<DrawerMenu store={store} navigation={navi}/>);
    expect(wrapper.dive()).toMatchSnapshot();
  });

  test('dispatches correct action on logout', () => {
    const navi = { navigate: () => {} }
    const wrapper = shallow(<DrawerMenu store={store} navigation={navi}/>);

    const logoutButton = wrapper.dive().find('TouchableHighlight');
    logoutButton.simulate('Press');

    const expectedActions = [{ type: 'LOGOUT' }];
    expect(store.getActions()).toEqual(expectedActions);
  });
});
