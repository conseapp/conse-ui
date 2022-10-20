import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import userReducer from './reducers';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { composeWithDevTools } from 'redux-devtools-extension';
import { createWrapper } from "next-redux-wrapper";

const persistConfig = {
    key: 'root',
    storage,
}

const rootReducer = combineReducers({ userReducer: persistReducer(persistConfig, userReducer), });
// const rootReducer = combineReducers({ userReducer: userReducer });
export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);
// export const wrapper = createWrapper(store);

const makeStore = () => store;
export const wrapper = createWrapper(makeStore);
// export default wrapper.withRedux(Conse);


