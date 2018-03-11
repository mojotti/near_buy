import { getCurrentLocation } from './Location';

let appState = null;

export const handleAppStateChange = nextAppState => {
  if (nextAppState !== appState && nextAppState === 'active') {
    console.log('app is active now');
    getCurrentLocation();
  }
};
