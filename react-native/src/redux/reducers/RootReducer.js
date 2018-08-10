import { combineReducers } from 'redux';
import { authorizationReducer } from './AuthorizationReducer';
import { locationReducer } from './LocationReducer';
import { navigationReducer } from './NavigationReducer';

const rootReducer = combineReducers({
  authorizationReducer,
  locationReducer,
  navigationReducer,
});

export default rootReducer;
