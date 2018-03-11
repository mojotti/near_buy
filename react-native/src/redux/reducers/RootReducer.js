import { combineReducers } from 'redux';
import { authorizationReducer } from './AuthorizationReducer';

const rootReducer = combineReducers({
  authorizationReducer,
});

export default rootReducer;
