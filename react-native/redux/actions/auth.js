export const login = (username, token) => {
  return {
    type: 'LOGIN',
    username,
    token,
  };
};

export const logout = () => {
  return {
    type: 'LOGOUT',
  };
};
