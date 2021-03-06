import { createNewChat, getChatsForUser } from '../../networking/ApiCalls';

export const createChatRequestAction = () => {
  return {
    type: 'CREATE_CHAT_REQUEST',
  };
};

export const createChatSuccessAction = () => {
  return {
    type: 'CREATE_CHAT_SUCCESSFUL',
  };
};

export const createChatErrorAction = error => {
  return {
    type: 'CREATE_CHAT_FAILURE',
    error,
  };
};

export const fetchChatsRequestAction = () => {
  return {
    type: 'FETCH_CHATS_REQUEST',
  };
};

export const fetchChatsSuccessAction = chatHeaders => {
  return {
    type: 'FETCH_CHATS_SUCCESS',
    chatHeaders,
  };
};

export const fetchChatsActionError = error => {
  return {
    type: 'FETCH_CHATS_ERROR',
    error,
  };
};

export const addMessageToChat = (chatId, message) => {
  return {
    type: 'ADD_MESSAGE_TO_CHAT',
    chatId,
    message,
  };
};

export const requestChats = token => {
  return dispatch => {
    dispatch(fetchChatsRequestAction());
    handleChatFetching(token, dispatch);
  };
};

export const handleChatFetching = (token, dispatch) => {
  getChatsForUser(token)
    .then(response => {
      if (response === 'error') {
        dispatch(fetchChatsActionError(response));
      } else if (response === 'could not get chats') {
        dispatch(fetchChatsActionError('could not get chats'));
      } else {
        dispatch(fetchChatsSuccessAction(response));
      }
    })
    .catch(error => dispatch(fetchChatsActionError(error)));
};

export const createChat = (itemDetails, token) => {
  return dispatch => {
    dispatch(createChatRequestAction());
    handleChatCreation(dispatch, itemDetails, token);
  };
};

export const handleChatCreation = (dispatch, itemDetails, token) => {
  createNewChat(itemDetails, token)
    .then(response => {
      if (response === 'chat created') {
        dispatch(createChatSuccessAction());
        dispatch(requestChats(token));
      } else {
        dispatch(createChatErrorAction(response));
      }
    })
    .catch(error => dispatch(createChatErrorAction(error)));
};
