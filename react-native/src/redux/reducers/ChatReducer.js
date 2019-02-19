import * as socketIO from '../../networking/socketIO';
/* eslint-disable indent */

const initialStateChatCreation = {
  isLoading: false,
  error: null,
};

export const chatCreationReducer = (
  state = initialStateChatCreation,
  action
) => {
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
  chatHeaders: [],
  error: null,
  isFetching: false,
};

export const currentChatsReducer = (
  state = initialStateCurrentChats,
  action
) => {
  switch (action.type) {
    case 'FETCH_CHATS_REQUEST':
      return Object.assign({}, state, {
        isFetching: true,
      });
    case 'FETCH_CHATS_SUCCESS':
      return Object.assign({}, state, {
        isFetching: false,
        chatHeaders: action.chatHeaders,
        error: null,
      });
    case 'FETCH_CHATS_ERROR':
      return Object.assign({}, state, {
        error: action.error,
        isFetching: false,
      });
    default:
      return state;
  }
};

const initialStateChatMessages = {
  chatMessages: {},
  error: null,
  isFetching: false,
};

export const chatMessagesReducer = (
  state = initialStateChatMessages,
  action
) => {
  console.log('state', state, action);
  switch (action.type) {
    case 'ADD_MESSAGE_TO_CHAT': {
      socketIO.sendMessage(action.message, action.chatId);
      const newMessages = getNewMessages(
        state.chatMessages,
        action.chatId,
        action.message
      );
      return Object.assign({}, state, {
        chatMessages: Object.assign(
          {
            [action.chatId]: newMessages,
          },
          state.chatMessages
        ),
      });
    }
    default:
      return state;
  }
};
const getNewMessages = (chats, chatId, msg) => {
  const chatToAppend = chats[chatId];

  if (!chatToAppend) {
    return [msg];
  } else {
    return chatToAppend.push(msg);
  }
};
