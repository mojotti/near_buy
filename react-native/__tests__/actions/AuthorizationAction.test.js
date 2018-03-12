import { login, logout } from '../../src/redux/actions/AuthorizationAction';
import { LOGIN, LOGOUT } from '../../src/redux/constants/actionTypes/ActionTypes';

describe('authorization actions', () => {
  it('should login with username and token', () => {
    const username = 'test_user';
    const token = 'test_token';
    const expectedAction = {
      type: LOGIN,
      username,
      token,
    };
    expect(login(username, token)).toEqual(expectedAction);
  });

  it('should logout', () => {
    const expectedAction = {
      type: LOGOUT,
    };
    expect(logout()).toEqual(expectedAction);
  });
});
