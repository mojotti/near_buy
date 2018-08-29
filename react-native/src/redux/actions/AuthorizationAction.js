export const login = (username, token, id) => {
  return {
    type: 'LOGIN',
    username,
    token,
    id,
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};
