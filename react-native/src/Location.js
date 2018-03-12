import { updateLocationAction } from './redux/actions/LocationAction';

let locationDispatch = null;
export const getCurrentLocation = dispatch => {
  if (dispatch) {
    locationDispatch = dispatch;
  }
  console.log('getting location...');

  navigator.geolocation.getCurrentPosition(
    position => {
      console.log(
        'coords: ',
        position.coords,
        'latitude: ',
        position.coords.latitude,
        'longitude: ',
        position.coords.longitude,
      );

      if (locationDispatch) {
        locationDispatch(updateLocationAction(position.coords));
      }
    },
    error => console.log('error in fetching location', error),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
};
