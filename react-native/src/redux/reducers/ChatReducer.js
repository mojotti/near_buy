const initialState = {
  chats: [],
  isLoading: false,
  error: null,
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'CREATE_CHAT_REQUEST':
    return Object.assign({}, state, {
      isLoading: true,
    });
  case 'CREATE_CHAT_SUCCESSFUL':
    return Object.assign({}, state, {
      isLoading: false,
      error: null,
    });
  case 'CREATE_CHAT_FAILURE':
    return Object.assign({}, state, {
      isLoading: false,
      error: action.error,
    });
  default:
    return state;
  }
};
