import { PermissionsAndroid } from 'react-native';
import { requestPermissions } from '../../src/Permissions';

describe('permission tests', () => {
  it('it does not throw error when permissions are granted', () => {
    PermissionsAndroid.request = jest.fn(() =>
      Promise.resolve(PermissionsAndroid.RESULTS.GRANTED)
    );

    return requestPermissions().then(result =>
      expect(result).toMatchSnapshot()
    );
  });

  it('throws error when permissions are not granted', () => {
    PermissionsAndroid.request = jest.fn(() =>
      Promise.resolve(PermissionsAndroid.RESULTS.DENIED)
    );

    return requestPermissions().catch(error => expect(error).toMatchSnapshot());
  });
});
