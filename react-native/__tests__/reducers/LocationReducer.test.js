import { locationReducer } from '../../src/redux/reducers/LocationReducer';
import { UPDATE_LOCATION } from '../../src/redux/constants/actionTypes/ActionTypes';

const NEW_COORDS = {
  coords: {
    latitude: 25.0,
    longitude: 60.0,
  },
};

const DEFAULT_STATE = {
  latitude: 0.0,
  longitude: 0.0,
};

describe('Location reducer', () => {
  test('location state is updated', () => {
    const locationUpdate = {
      type: UPDATE_LOCATION,
      ...NEW_COORDS,
    };

    const expectedCoords = {
      latitude: 25.0,
      longitude: 60.0,
    };
    expect(locationReducer(DEFAULT_STATE, locationUpdate)).toEqual(
      expectedCoords,
    );
  });

  test('location state update action is invalid', () => {
    const invalidAction = {
      type: 'DO_NOT_UPDATE_LOCATION',
      ...DEFAULT_STATE,
    };
    expect(locationReducer(DEFAULT_STATE, invalidAction)).toEqual(
      DEFAULT_STATE,
    );
  });
});
