import { PermissionsAndroid } from 'react-native';
import { requestPermissions } from '../../src/Permissions';

describe('permission tests', () => {
  it('it does not throw error when permissions are granted', () => {
    const permissionSpy = {
      request: () => {
        return new Promise.resolve(PermissionsAndroid.RESULTS.GRANTED);
      },
    };

    return requestPermissions(permissionSpy).then(result =>
      expect(result).toMatchSnapshot(),
    );
  });

  it('throws error when permissions are not granted', () => {
    const permissionSpy = {
      request: () => {
        return new Promise.resolve(PermissionsAndroid.RESULTS.DENIED);
      },
    };

    return requestPermissions(permissionSpy).catch(error =>
      expect(error).toMatchSnapshot(),
    );
  });
});
