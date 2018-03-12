const initialState = {
  isLoggedIn: false,
  username: '',
  token: '',
};

export const authorizationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'LOGIN':
    return Object.assign({}, state, {
      isLoggedIn: true,
      username: action.username,
      token: action.token,
    });
  case 'LOGOUT':
    return Object.assign({}, state, {
      isLoggedIn: false,
      username: '',
      token: '',
    });
  default:
    return state;
  }
};
