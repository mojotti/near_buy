import { Platform } from 'react-native';
import { getCurrentLocation } from './Location';
import { requestPermissions } from './Permissions';
import { requestItemsAction } from './redux/actions/ItemExplorerAction';

export const runAppStartEvents = (dispatch, token) => {
  if (Platform.OS === 'android') {
    requestPermissions().then(() => getCurrentLocation(dispatch));
  } else {
    getCurrentLocation(dispatch);
  }
  dispatch(requestItemsAction(token));
  dispatch(requestChatsAction(token));
};
