import { getCurrentLocation } from './Location';
import { requestPermissions } from './Permissions';

export const runAppStartEvents = (dispatch) => {
  requestPermissions().then(() => getCurrentLocation(dispatch));
};
