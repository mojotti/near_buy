import { combineReducers } from 'redux';
import { authorizationReducer } from './auth';

const rootReducer = combineReducers({
  authorizationReducer,
});

export default rootReducer;
