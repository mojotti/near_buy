export const login = (username, hash) => {
    return {
        type: 'LOGIN',
        username: username,
        hash: hash
    };
};

export const logout = () => {
    return {
        type: 'LOGOUT'
    };
};

export const signup = (username, password) => {
    return (dispatch) => {
    };
};
