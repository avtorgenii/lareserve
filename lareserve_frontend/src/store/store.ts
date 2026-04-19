import { configureStore } from '@reduxjs/toolkit';

import { listenerMiddleware } from './listenerMiddleware';
import { rootReducer } from './rootReducer';

export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });

export const store = setupStore();

export type AppStore = typeof store;
export type AppDispatch = AppStore['dispatch'];
