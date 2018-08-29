import React from 'react';
import { shallow } from 'enzyme';
import { _UserItemDetails } from '../../../src/components/user_items/UserItemDetails';


let setParamsSpy = null;
let PROPS = null;

const getProps = paramsSpy => {
  return {
    navigation: {
      state: {
        params: {
          item: {
            id: 0,
            title: 'foo',
            description: 'bar',
            price: 100,
            item_created: 103042050,
            longitude: 25,
            latitude: 65.02,
          },
          fetchItems: () => {},
          isEdited: true,
        },
      },
      setParams: paramsSpy,
    },
    location: {
      longitude: 24,
      latitude: 65,
    },
    token: 'foo',
  };
};

describe('<_UserItemDetails />', () => {
  beforeEach(() => {
    setParamsSpy = jest.fn();
    PROPS = getProps(setParamsSpy);
  });

  test('renders correctly', () => {
    fetch.mockResponseSuccess({ num_of_images: 1 });
    const userItemDetails = shallow(<_UserItemDetails {...PROPS} />);

    expect(userItemDetails).toMatchSnapshot();
  });

  test('component did update', () => {
    fetch.mockResponseSuccess({ num_of_images: 1 });
    const userItemDetails = shallow(<_UserItemDetails {...PROPS} />);
    expect(setParamsSpy.mock.calls.length).toEqual(1);

    const prevState = {
      title: 'bar',
      price: 450,
    };
    userItemDetails.instance().componentDidUpdate({}, prevState);
    expect(setParamsSpy.mock.calls.length).toEqual(2);
  });

  test('state handlers', () => {
    fetch.mockResponseSuccess({ num_of_images: 1 });

    const userItemDetails = shallow(<_UserItemDetails {...PROPS} />);

    expect(userItemDetails.state('title')).toEqual('foo');
    expect(userItemDetails.state('description')).toEqual('bar');
    expect(userItemDetails.state('price')).toEqual(100);
    expect(userItemDetails.state('latitude')).toEqual(65.02);
    expect(userItemDetails.state('longitude')).toEqual(25);

    userItemDetails.instance().handleTitleChange('title');
    userItemDetails.instance().handleDescriptionChange('description');
    userItemDetails.instance().handlePriceChange(250);
    userItemDetails.instance().updateLocation();

    expect(userItemDetails.state('title')).toEqual('title');
    expect(userItemDetails.state('description')).toEqual('description');
    expect(userItemDetails.state('price')).toEqual(250);
    expect(userItemDetails.state('latitude')).toEqual(65);
    expect(userItemDetails.state('longitude')).toEqual(24);
  });

  test('navigation options', () => {
    const navigation = {
      state: {
        params: {
          item: {
            id: 0,
            title: 'foo',
            description: 'bar',
            price: 100,
            item_created: 103042050,
            longitude: 25,
            latitude: 65.02,
          },
          fetchItems: () => {},
          isEdited: true,
        },
      },
    };

    const params = { navigation };
    expect(_UserItemDetails.navigationOptions(params)).toMatchSnapshot();
  });
});
