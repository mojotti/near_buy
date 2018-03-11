export const getCurrentLocation = () => {
  console.log('getting location...');

  navigator.geolocation.getCurrentPosition(
    position => {
      console.log(
        'latitude: ',
        position.coords.latitude,
        'longitude: ',
        position.coords.longitude,
      );
    },
    error => console.log('error in fetching location', error),
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
  );
};
