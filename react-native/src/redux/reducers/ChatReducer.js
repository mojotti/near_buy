const initialStateChatCreation = {
  isLoading: false,
  error: null,
};

export const chatCreationReducer = (state = initialStateChatCreation, action) => {
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

const initialStateCurrentChats = {
  chats: [],
  error: null,
  isFetching: false,
};

export const currentChatsReducer = (state = initialStateCurrentChats, action) => {
  switch (action.type) {
  case 'FETCH_CHATS_REQUEST':
    return Object.assign({}, state, {
      isFetching: true,
    });
  case 'FETCH_CHATS_SUCCESS':
    return Object.assign({}, state, {
      isFetching: false,
      chats: action.chats,
      error: null,
    });
  case 'FETCH_CHATS_ERROR':
    return Object.assign({}, state, {
      error: null,
    });
  default:
    return state;
  }
}
