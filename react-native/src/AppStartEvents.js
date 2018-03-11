import { getCurrentLocation } from './Location';
import { requestPermissions } from './Permissions';

export const runAppStartEvents = () => {
  requestPermissions().then(() => getCurrentLocation());
};
