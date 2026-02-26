import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { baseApi } from '../api/baseApi';
import { authReducer } from './authSlice';
import { settingsReducer } from './settingsSlice';
import { PERSIST_KEY } from '../../shared/config/constants';

const authTransform = createTransform(
  (state: { user: unknown; token: unknown; isInitialized: boolean }) => ({
    user: state.user,
    token: state.token,
  }),
  (out) => ({ ...out, isInitialized: false }),
  { whitelist: ['auth'] }
);

const persistConfig = {
  key: PERSIST_KEY,
  storage,
  whitelist: ['auth', 'settings'],
  transforms: [authTransform],
};

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  settings: settingsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
