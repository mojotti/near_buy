import { combineReducers } from 'redux';
import { authorizationReducer } from './AuthorizationReducer';
import { locationReducer } from './LocationReducer';

const rootReducer = combineReducers({
  authorizationReducer,
  locationReducer,
});

export default rootReducer;
