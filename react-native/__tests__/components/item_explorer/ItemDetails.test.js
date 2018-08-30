import React from 'react';
import { shallow } from 'enzyme';
import { _ItemDetails } from '../../../src/components/item_explorer/ItemDetails';

jest.mock('../../../src/networking/ApiCalls.js', () => {
  return {
    getNumOfPictures: () => Promise.resolve(2)
  };
});

const ITEM = {
  title: 'foo',
  id: 0,
  buyer_id: 0,
  seller_id: 0,
  description: 'bar',
};

const PROPS = {
  item: {
    title: 'foo',
    description: 'bar',
  },
  navigation: {
    state: {
      params: {
        item: {
          title: 'foo'
        }
      }
    }
  },
  token: 'fake token',
  distance: '2 km',
  isCreatingChat: false,
  error: null,
  id: 1
};
describe('<_ItemDetails />', () => {
  test('renders correctly', () => {
    fetch.mockResponseSuccess({ numOfImages: 2 });

    const wrapper = shallow(<_ItemDetails {...PROPS} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('chat is created', () => {
    const wrapper = shallow(
      <_ItemDetails
        isCreatingChat={false}
        error={null}
        token="foo"
        item={[]}
        distance="2 km"
        id={2}
      />
    );

    const result = wrapper.instance()._isChatCreated({ isCreatingChat: true });
    expect(result).toBeTruthy();
  });

  test('chat is not created', () => {
    let wrapper = shallow(
      <_ItemDetails
        isCreatingChat={false}
        error={null}
        token="foo"
        item={[]}
        distance="2 km"
        id={2}
      />
    );

    let result = wrapper.instance()._isChatCreated({ isCreatingChat: false });
    expect(result).toBeFalsy();

    wrapper = shallow(
      <_ItemDetails
        isCreatingChat
        error={undefined}
        token="foo"
        item={[]}
        distance="2 km"
        id={2}
      />
    );

    result = wrapper.instance()._isChatCreated({ isCreatingChat: true });
    expect(result).toBeFalsy();
  });

  test('opens chat on button press', () => {
    const dispatchSpy = jest.fn();
    const wrapper = shallow(
      <_ItemDetails
        isCreatingChat={false}
        error={null}
        token="foo"
        item={[]}
        distance="2 km"
        id={2}
        dispatch={dispatchSpy}
      />
    );

    wrapper.find('ChatButton').simulate('Press');
    expect(dispatchSpy.mock.calls).toMatchSnapshot();
  });

  test('navigates to chat on component did update when appropriate', () => {
    const naviSpy = jest.fn();
    const navigation = {
      navigate: naviSpy
    };

    const wrapper = shallow(
      <_ItemDetails
        navigation={navigation}
        isCreatingChat={false}
        error={null}
        token="foo"
        item={ITEM}
        distance="2 km"
        id={2}
        dispatch={() => {}}
      />
    );

    wrapper.instance().componentDidUpdate({ isCreatingChat: true });
    const expected = [['Chat', { item: { buyer_id: 2, id: 0, seller_id: 0, title: 'foo' } }]];

    expect(naviSpy.mock.calls).toEqual(expected)
  });
});
