import { createNewChat } from '../../networking/ApiCalls';

export const createChatRequestAction = () => {
  return {
    type: 'CREATE_CHAT_REQUEST',
  };
};

export const createChatSuccessAction = () => {
  return {
    type: 'CREATE_CHAT_SUCCESSFUL',
  };
};

export const createChatErrorAction = (error) => {
  return {
    type: 'CREATE_CHAT_FAILURE',
    error,
  };
};

export const fetchChatsRequestAction = () => {
  return {
    type: 'FETCH_CHATS_REQUEST',
  };
};

export const fetchChatsSuccessAction = (chats) => {
  return {
    type: 'FETCH_CHATS_SUCCESS',
    chats,
  };
};

export const fetchChatsActionError = (error) => {
  return {
    type: 'FETCH_CHATS_ERROR',
    error,
  };
};

export const requestChatsAction = (token) => {
  return (dispatch) => {
    dispatch(fetchChatsRequestAction());
    handleChatFetching(token, dispatch);
  };
};

export const handleChatFetching = (token, dispatch) => {
  fetchChats(token)
    .then((response) => {
      if (response.ok && response.chats) {
        dispatch(fetchChatsSuccessAction(response.chats));
      } else {
        dispatch(fetchChatsActionError(response));
      }
    });
};

export const createChatAction = (sellerId, itemId, token) => {
  return (dispatch) => {
    dispatch(createChatRequestAction());
    handleChatCreation(dispatch, sellerId, itemId, token);
  };
};

export const handleChatCreation = (dispatch, sellerId, itemId, token) => {
  createNewChat(sellerId, itemId, token)
    .then((response) => {
      if (response === 'chat created') {
        dispatch(createChatSuccessAction());
      } else {
        dispatch(createChatErrorAction(response));
      }
    })
    .catch((error) => dispatch(createChatErrorAction(error)));
};

