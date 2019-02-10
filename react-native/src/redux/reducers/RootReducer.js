import { combineReducers } from 'redux';
import { authorizationReducer } from './AuthorizationReducer';
import { locationReducer } from './LocationReducer';
import { navigationReducer } from './NavigationReducer';
import { itemExplorerReducer } from './ItemExplorerReducer';
import {
  chatCreationReducer,
  chatMessagesReducer,
  currentChatsReducer,
} from './ChatReducer';

const rootReducer = combineReducers({
  authorizationReducer,
  locationReducer,
  navigationReducer,
  itemExplorerReducer,
  chatCreationReducer,
  currentChatsReducer,
  chatMessagesReducer,
});

export default rootReducer;
