import { Platform } from 'react-native';
import { getCurrentLocation } from './Location';
import { requestPermissions } from './Permissions';

export const runAppStartEvents = (dispatch) => {
  if (Platform.OS === 'android') {
    requestPermissions().then(() => getCurrentLocation(dispatch));
  } else {
    getCurrentLocation(dispatch);
  }
};
