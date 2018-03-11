import 'isomorphic-fetch'; // for headers, fetch, etc.;
import React from 'react';
import { Alert } from 'react-native';
import renderer from 'react-test-renderer';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import store from '../../../redux/index';
import { NewItem } from '../../../src/components/new_item/NewItem';

const token = {
  authorizationReducer: {
    token: 'jippii',
  },
};
store.getState = jest.fn(() => token);
jest.mock('react-navigation', () => {
  return {
    NavigationActions: {
      reset: jest.fn(() => {}),
      navigate: jest.fn(() => {}),
    },
  };
});

describe('<New Item />', () => {
  beforeEach(() => {
    Alert.alert = jest.fn();
  });

  test('renders correctly', () => {
    const newItem = renderer.create(<NewItem />);

    expect(newItem.toJSON()).toMatchSnapshot();
  });

  test('calls handle new item when submit is pressed', () => {
    const handleNewItem = sinon.spy(NewItem.prototype, 'handleNewItemCreation');

    const newItemComponent = shallow(<NewItem />);

    newItemComponent
      .find('ScrollView')
      .find('TouchableHighlight')
      .simulate('Press');

    expect(handleNewItem.callCount).toEqual(1);
    handleNewItem.restore();
  });

  test('set new image changes state', () => {
    const newItemComponent = shallow(<NewItem />);
    const newItemInstance = newItemComponent.instance();

    const image = { path: 'picture_of_me.png' };
    const index = 1;
    newItemInstance.setNewImage(image, index);

    expect(newItemComponent.state('images')[index]).toEqual(image);
  });

  test('sets state correctly', () => {
    const newItemComponent = shallow(<NewItem />);
    const newItemInstance = newItemComponent.instance();

    const title = 'foo';
    const description = 'bar';
    const price = 666;

    newItemInstance.handleTitleChange(title);
    newItemInstance.handleDescriptionChange(description);
    newItemInstance.handlePriceChange(price);

    expect(newItemComponent.state('title')).toEqual(title);
    expect(newItemComponent.state('description')).toEqual(description);
    expect(newItemComponent.state('price')).toEqual(price);
  });

  test('gets correct header', () => {
    const newItemComponent = shallow(<NewItem />);
    const newItemInstance = newItemComponent.instance();

    const header = newItemInstance.getHeaders();
    expect(header).toMatchSnapshot();
  });

  test('handles new item creation', () => {
    fetch.mockResponseSuccess('foo');

    const newItemComponent = shallow(<NewItem />);
    const newItemInstance = newItemComponent.instance();

    newItemComponent.setState({ title: 'title' });
    newItemComponent.setState({ description: 'description' });
    newItemComponent.setState({ price: 10 });

    newItemInstance.handleNewItemCreation();
  });

  test('handles new item creation response', () => {
    const navigateSpy = sinon.spy(
      NewItem.prototype,
      'resetNavigationAndNavigateToRoute',
    );

    const navigation = { dispatch: jest.fn() };
    const newItemComponent = shallow(<NewItem navigation={navigation} />);
    const newItemInstance = newItemComponent.instance();

    newItemComponent.setState({ title: 'title' });
    const response = {
      item: {
        title: 'title',
      },
    };
    newItemInstance.handleResponse(response);
    expect(navigateSpy.calledOnce).toBeTruthy();
  });

  test('handles new item creation response', () => {
    const newItemComponent = shallow(<NewItem />);
    const newItemInstance = newItemComponent.instance();

    const response = {
      item: {
        title: 'title',
      },
    };

    newItemInstance.handleResponse(response);

    const expectedAlert = [['Item creation failed', 'Something went wrong']];

    expect(Alert.alert.mock.calls.length).toBe(1);
    expect(Alert.alert.mock.calls).toEqual(expectedAlert);
  });
});
