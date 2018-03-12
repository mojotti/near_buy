import { UPDATE_LOCATION } from '../../src/redux/constants/actionTypes/ActionTypes';
import { updateLocationAction } from '../../src/redux/actions/LocationAction';

describe('location actions', () => {
  it('should update location', () => {
    const coords = {
      latitude: 65.00002,
      longitude: 25.00023,
    };

    const expectedAction = {
      type: UPDATE_LOCATION,
      coords,
    };
    expect(updateLocationAction(coords)).toEqual(expectedAction);
  });
});
