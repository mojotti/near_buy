import React from 'react';
import { shallow } from 'enzyme';
import { _ItemCard } from '../../../src/components/item_explorer/ItemCard';

const ITEM = {
  item: {
    title: 'foo',
    id: 0,
    price: 10,
  },
  latitude: 65, // oulu
  longitude: 25,
};
const LOCATION = {
  lat: 60.192059, // helsinki
  lon: 24.945831,
};

describe('<_ItemCard />', () => {
  test('gets distance in km between two coordinates', () => {
    const ouluHelsinkiDistance = '534.6 km';

    const wrapper = shallow(
      <_ItemCard item={ITEM} latitude={LOCATION.lat} longitude={LOCATION.lon} />
    );

    expect(wrapper.state('distanceInKm')).toEqual(ouluHelsinkiDistance);
  });

  test('navigates to item on press', () => {
    const naviSpy = jest.fn();
    const navi = {
      navigate: naviSpy,
    };
    const wrapper = shallow(
      <_ItemCard
        item={ITEM}
        latitude={LOCATION.lat}
        longitude={LOCATION.lon}
        navigation={navi}
      />
    );
    const touchableArea = wrapper.find('TouchableOpacity');
    touchableArea.simulate('Press');

    expect(naviSpy.mock.calls).toMatchSnapshot();
    expect(naviSpy.mock.calls.length).toEqual(1);
  });

  test('component did update updates distance when prop differs', () => {
    const wrapper = shallow(
      <_ItemCard item={ITEM} latitude={LOCATION.lat} longitude={LOCATION.lon} />
    );

    const getDistanceSpy = jest.spyOn(wrapper.instance(), '_getDistanceInKm');
    const prevProps = {
      item: {
        latitude: 64,
        longitude: 25,
      },
    };
    expect(getDistanceSpy.mock.calls.length).toEqual(0);
    wrapper.instance().componentDidUpdate(prevProps);

    expect(getDistanceSpy.mock.calls.length).toEqual(1);
  });
});
