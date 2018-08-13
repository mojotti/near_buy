import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import UserItemMapView from "../../../src/components/user_items/UserItemMapView";

const CURRENT_LOCATION = {
  latitude: 42.000,
  longitude: 105.00,
};


describe('<UserItemMapView', () => {
  jest.useFakeTimers();

  test('renders correctly', () => {
    const userItemMapView = shallow(
      <UserItemMapView
        longitude={25.000}
        latitude={64.000}
        currentLocation={CURRENT_LOCATION}
      />,
    );
    expect(userItemMapView).toMatchSnapshot();
  });

  test('gets center location', () => {
    const userItemMapView = shallow(
      <UserItemMapView
        longitude={25.000}
        latitude={64.000}
        currentLocation={CURRENT_LOCATION}
      />,
    );

    const expectedCenterLocation = { centerLatitude: 53, centerLongitude: 65 };
    const centerLocation = userItemMapView.instance().getCenterLocation();

    expect(centerLocation).toEqual(expectedCenterLocation);
  });

  test('gets location deltas', () => {
    const userItemMapView = shallow(
      <UserItemMapView
        longitude={25.000}
        latitude={64.000}
        currentLocation={CURRENT_LOCATION}
      />,
    );

    const expectedDeltas = { latitudeDelta: 22.006, longitudeDelta: 80.0017 };
    const deltas = userItemMapView.instance().getLocationDeltas();

    expect(deltas).toEqual(expectedDeltas);
  });

  test('animates to new location when location changes', () => {
    const userItemMapView = shallow(
      <UserItemMapView
        longitude={25.000}
        latitude={64.000}
        currentLocation={CURRENT_LOCATION}
      />,
    );

    const instance = userItemMapView.instance();
    const animateSpy = jest.spyOn(instance, 'animateItemToNewLocation');
    expect(animateSpy.mock.calls.length).toEqual(0);

    instance.componentDidUpdate(CURRENT_LOCATION);
    expect(animateSpy.mock.calls.length).toEqual(1);
  });

  test('does not animate to new location when location stays the same', () => {
    const userItemMapView = shallow(
      <UserItemMapView
        longitude={25.000}
        latitude={64.000}
        currentLocation={CURRENT_LOCATION}
      />,
    );

    const instance = userItemMapView.instance();
    const animateSpy = jest.spyOn(instance, 'animateItemToNewLocation');
    expect(animateSpy.mock.calls.length).toEqual(0);

    instance.componentDidUpdate({ latitude: 64, longitude: 25 });
    expect(animateSpy.mock.calls.length).toEqual(0);
  });
});
