import { configureStore } from '@reduxjs/toolkit';

import { notificationsReducer } from './Notifications/data';
import { toursReducer } from './Notifications/tours/data';

export function initializeStore(preloadedState = undefined) {
  return configureStore({
    reducer: {
      notifications: notificationsReducer,
      tour: toursReducer,
    },
    preloadedState,
  });
}

const store = initializeStore();

export default store;
