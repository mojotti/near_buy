import { combineReducers } from 'redux';
import { authorizationReducer } from './AuthorizationReducer';
import { locationReducer } from './LocationReducer';
import { navigationReducer } from './NavigationReducer';
import { itemExplorerReducer } from './ItemExplorerReducer';

const rootReducer = combineReducers({
  authorizationReducer,
  locationReducer,
  navigationReducer,
  itemExplorerReducer,
});

export default rootReducer;
