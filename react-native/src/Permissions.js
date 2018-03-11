import { PermissionsAndroid } from 'react-native';

export const requestPermissions = (
  permissionAPI = PermissionsAndroid,
): void => {
  return requestStoragePermissions(permissionAPI)
    .then(granted => {
      // (granted == true) is checked in case of API levels < 23, which
      // does not return 'granted' like never APIs do.
      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
        return requestLocationPermissions(permissionAPI);
      } else {
        throw new Error('Permissions are not granted');
      }
    })
    .then(granted => {
      // (granted == true) is checked in case of API levels < 23, which
      // does not return 'granted' like never APIs do.
      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
        return requestCameraPermissions(permissionAPI);
      } else {
        throw new Error('Permissions are not granted');
      }
    })
    .then(granted => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
        return Promise.resolve(granted);
      } else {
        throw new Error('Permissions are not granted');
      }
    });
};

const requestLocationPermissions = (
  permissionAPI = PermissionsAndroid,
): void => {
  return permissionAPI
    .request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: 'Location Permissions',
      message: 'NearBuy needs to access your location',
    })
    .then(granted => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
        return Promise.resolve(granted);
      } else {
        throw new Error('Location permissions are not granted');
      }
    });
};

const requestStoragePermissions = (
  permissionAPI = PermissionsAndroid,
): void => {
  return permissionAPI
    .request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permissions',
        message: 'NearBuy needs the access to your external storage',
      },
    )
    .then(granted => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
        return Promise.resolve(granted);
      } else {
        throw new Error('Storage permissions are not granted');
      }
    });
};

const requestCameraPermissions = (permissionAPI = PermissionsAndroid): void => {
  return permissionAPI
    .request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Camera Permissions',
      message: 'NearBuy needs to use camera',
    })
    .then(granted => {
      if (granted === PermissionsAndroid.RESULTS.GRANTED || granted === true) {
        return Promise.resolve(granted);
      } else {
        throw new Error('Storage permissions are not granted');
      }
    });
};
