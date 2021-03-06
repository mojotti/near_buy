import { Platform } from 'react-native';
import { getCurrentLocation } from './Location';
import { requestPermissions } from './Permissions';
import { requestItemsAction } from './redux/actions/ItemExplorerAction';
import { requestChats } from './redux/actions/ChatActions';

export const runAppStartEvents = (dispatch, token) => {
  if (Platform.OS === 'android') {
    requestPermissions().then(() => getCurrentLocation(dispatch));
  } else {
    getCurrentLocation(dispatch);
  }
  dispatch(requestItemsAction(token));
  dispatch(requestChats(token));
};
