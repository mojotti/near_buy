import { authorizationReducer } from '../../redux/reducers/auth';

const testUsername = 'testUsername';
const testToken = 'testToken';
const defaultState = {
  isLoggedIn: false,
  username: '',
  token: '',
};
const loggedInState = {
  isLoggedIn: true,
  username: testUsername,
  token: testToken,
};

test('return default state when invalid type passed to authorizationReducer', () => {
  const invalidActionType = { type: 'invalid' };
  expect(authorizationReducer(defaultState, invalidActionType)).toEqual(defaultState);
});

test('return logged in state when logged in with correct details', () => {
  const login = {
    type: 'LOGIN',
    username: testUsername,
    token: testToken,
  };
  expect(authorizationReducer(defaultState, login)).toEqual(loggedInState);
});

test('return logged out state when logging out with correct details', () => {
  const logout = {
    type: 'LOGOUT',
  };
  expect(authorizationReducer(loggedInState, logout)).toEqual(defaultState);
});
