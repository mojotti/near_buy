import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import createEncryptor from 'redux-persist-transform-encrypt';

import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers/RootReducer';

const encryptor = createEncryptor({
  secretKey: '$b1!j)%z_$n&adltvihhoesu24+^b!89c@emh83w1kc%7yo$ke',
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authorizationReducer'], // store only auth info
  transforms: [encryptor],
};

const reducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(
  reducer,
  applyMiddleware(thunk),
);
export const persistor = persistStore(store);
