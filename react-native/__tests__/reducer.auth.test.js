import reducer from '../redux/reducers/auth';

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

test('return default state when invalid type passed to reducer', () => {
  const invalidActionType = { type: 'invalid' };
  expect(reducer(defaultState, invalidActionType)).toBe(defaultState);
});

test('return logged in state when logged in with correct details', () => {
  const login = {
    type: 'LOGIN',
    username: testUsername,
    token: testToken,
  };
  expect(reducer(defaultState, login)).toEqual(loggedInState);
});

test('return logged out state when logging out with correct details', () => {
  const logout = {
    type: 'LOGOUT',
  };
  expect(reducer(loggedInState, logout)).toEqual(defaultState);
});
