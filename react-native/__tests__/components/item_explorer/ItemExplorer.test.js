import React from 'react';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import ItemExplorer, { _ItemExplorer } from '../../../src/components/item_explorer/ItemExplorer';
import configureStore from 'redux-mock-store';

const generateItems = () => {
  const items = [];
  for (let i = 0; i < 5; i++) {
    items.push({
      description: `description ${i}`,
      id: i,
      item_created: i * 10000,
      latitude: 60 + i,
      longitude: 20 + i,
      price: 100 * i,
      seller_id: i,
      sold: false,
      title: `item ${i}`,
      uri: `uri${i}`
    });
  }
  return items;
};

describe('<_ItemExplorer />', () => {
  test('renders loader when is fetching', () => {
    const wrapper = shallow(<_ItemExplorer isFetching items={{}} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('renders placeholder when not rendering and no items', () => {
    const wrapper = shallow(<_ItemExplorer isFetching={false} items={'no items'} />);
    expect(wrapper).toMatchSnapshot();

    const wrapperTwo = shallow(<_ItemExplorer isFetching={false} items={[]} />);
    expect(wrapperTwo).toMatchSnapshot();
  });

  test('renders carousel when there is items', () => {
    const middlewares = [];
    const mockStore = configureStore(middlewares);

    const initialState = {
      itemExplorerReducer: {
        isFetching: false,
        items: generateItems(),
      }
    };
    const store = mockStore(initialState);

    const wrapper = shallow(<ItemExplorer store={store} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('navigation options', () => {
    const navi = { navigation: { navigate: () => {} } };
    const naviOptions = _ItemExplorer.navigationOptions(navi);

    expect(naviOptions).toMatchSnapshot();
  });
});
