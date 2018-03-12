import { updateLocationAction } from './redux/actions/LocationAction';

export const getCurrentLocation = dispatch => {
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
      dispatch(updateLocationAction(position.coords));
    },
    error => console.log('error in fetching location', error),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
};
