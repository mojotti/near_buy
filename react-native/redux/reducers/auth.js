const defaultState = {
    isLoggedIn: false,
    username: '',
    password: ''
};

export default function reducer(state = defaultState, action) {
    switch (action.type) {
        case 'LOGIN':
            return Object.assign({}, state, {
                isLoggedIn: true,
                username: action.username,
                hash: action.hash
            });
        case 'LOGOUT':
            return Object.assign({}, state, {
                isLoggedIn: false,
                username: '',
                hash: ''
            });
        default:
            return state;
    }
}
