import { combineReducers } from 'redux';
import { authorizationReducer } from './AuthorizationReducer';
import { locationReducer } from './LocationReducer';
import { navigationReducer } from './NavigationReducer';
import { itemExplorerReducer } from './ItemExplorerReducer';
import { chatReducer } from './ChatReducer';

const rootReducer = combineReducers({
  authorizationReducer,
  locationReducer,
  navigationReducer,
  itemExplorerReducer,
  chatReducer
});

export default rootReducer;
