import reducer from '../redux/reducers/auth.js';

const testUsername = 'testUsername';
const testToken = 'testToken';
const defaultState = {
    isLoggedIn: false,
    username: '',
    token: ''
};
const loggedInState = {
    isLoggedIn: true,
    username: testUsername,
    token: testToken
};

it('return default state when invalid type passed to reducer', () => {
    const invalidActionType = { type: 'invalid' };
    expect(reducer(defaultState, invalidActionType)).toBe(defaultState);
});

it('return logged in state when logged in with correct details', () => {
    const login = {
        type: 'LOGIN',
        username: testUsername,
        token: testToken
    };
    expect(reducer(defaultState, login)).toEqual(loggedInState);
});

it('return logged out state when logging out with correct details', () => {
    const logout = {
        type: 'LOGOUT',
    };
    expect(reducer(loggedInState, logout)).toEqual(defaultState);
});
