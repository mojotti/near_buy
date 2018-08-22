import React from 'react';
import { shallow } from 'enzyme';
import { _ItemCard } from '../../../src/components/item_explorer/ItemCard';

const ITEM = {
  item: {
    title: 'foo',
    id: 0,
  },
  latitude: 0,
  longitude: 0,
};
const LOCATION = {
  lat: 15,
  lon: 100,
};

describe('<_ItemCard />', () => {
  test('transfers degrees to radians', () => {
    const oneDegreeToRadian = 0.0174532925; // accuracy of ten decimals

    const wrapper = shallow(
      <_ItemCard
        item={ITEM}
        latitude={LOCATION.lat}
        longitude={LOCATION.lon}
      />
    );
    const result = wrapper.instance()._degreesToRadians(1);

    expect(eval(result.toFixed(10))).toEqual(oneDegreeToRadian);
  });

  test('gets distance in km between two coordinates', () => {
    const ouluHelsinkiDistance = '534.6 km';
    const oulu = { lat: 65, lon: 25 }; // not really but almost
    const helsinki = { lat: 60.192059, lon: 24.945831 };

    const wrapper = shallow(
      <_ItemCard
        item={ITEM}
        latitude={LOCATION.lat}
        longitude={LOCATION.lon}
      />
    );
    wrapper
      .instance()
      ._getDistanceInKm(oulu.lat, oulu.lon, helsinki.lat, helsinki.lon);

    expect(wrapper.state('distanceInKm')).toEqual(ouluHelsinkiDistance);
  });

  test('navigates to item on press', () => {
    const naviSpy = jest.fn();
    const navi = {
      navigate: naviSpy
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
      <_ItemCard
        item={ITEM}
        latitude={LOCATION.lat}
        longitude={LOCATION.lon}
      />
    );

    const getDistanceSpy = jest.spyOn(wrapper.instance(), '_getDistanceInKm')
    const prevProps = {
      item: {
        latitude: 64,
        longitude: 25,
      }
    };
    expect(getDistanceSpy.mock.calls.length).toEqual(0);
    wrapper.instance().componentDidUpdate(prevProps);

    expect(getDistanceSpy.mock.calls.length).toEqual(1);
  });
});
