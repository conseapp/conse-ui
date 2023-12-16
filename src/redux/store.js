import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import userReducer, { phaseReducer, timeReducer } from './reducers';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
    key: 'root',
    storage,
}

const userPersistConfig = {
    key: 'user',
    storage,
};

const phasePersistConfig = {
    key: 'phase',
    storage,
};

const timePersistConfig = {
    key: 'time',
    storage,
};

const userReducerPersisted = persistReducer(userPersistConfig, userReducer);
const phaseReducerPersisted = persistReducer(phasePersistConfig, phaseReducer);
const timeReducerPersisted = persistReducer(timePersistConfig, timeReducer);

const rootReducer = combineReducers({
    userReducer: userReducerPersisted,
    phaseReducer: phaseReducerPersisted,
    timeReducer: timeReducerPersisted,
});


export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));
export const persistor = persistStore(store);
