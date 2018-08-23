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
