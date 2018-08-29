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
      id: action.id,
    });
  case 'LOGOUT':
    return Object.assign({}, state, {
      isLoggedIn: false,
      username: '',
      token: '',
      id: '',
    });
  default:
    return state;
  }
};
