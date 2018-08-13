import React from 'react';
import { shallow } from 'enzyme';
import { _MenuItem } from '../../src/components/drawer/MenuItem';

describe('<_MenuItem />', () => {
  test('renders correctly when tab is current tab', () => {
    const menuItem = shallow(
      <_MenuItem itemName={'current'} currentTab={'current'} />
    );

    expect(menuItem).toMatchSnapshot();
  });

  test('renders correctly when tab is not the current tab', () => {
    const menuItem = shallow(
      <_MenuItem itemName={'not current'} currentTab={'current'} />
    );

    expect(menuItem).toMatchSnapshot();
  });

  test('navigates when menu item is pressed', () => {
    const dispatchSpy = jest.fn();
    const menuItem = shallow(
      <_MenuItem
        itemName={'not current'}
        currentTab={'current'}
        dispatch={dispatchSpy}
        navigationRoute="foo"
        navigation={{ dispatch: () => {} }}
      />,
    );

    menuItem.find('TouchableOpacity').simulate('Press');
    expect(dispatchSpy.mock.calls.length).toEqual(1);
  });
});

