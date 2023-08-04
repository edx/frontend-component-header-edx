/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/slice';

const userNotificationsToursSlice = createSlice({
  name: 'userNotificationTours',
  initialState: {
    tours: [],
    loading: RequestStatus.SUCCESSFUL,
    error: null,
  },
  reducers: {
    notificationsTourRequest: (state) => {
      state.loading = RequestStatus.IN_PROGRESS;
      state.error = null;
    },
    fetchNotificationsToursSuccess: (state, action) => {
      state.tours = action.payload;
      state.loading = RequestStatus.SUCCESSFUL;
      state.error = null;
    },
    notificationsToursRequestError: (state, action) => {
      state.loading = RequestStatus.FAILED;
      state.error = action.payload;
    },
    updateNotificationsTourSuccess: (state, action) => {
      const tourIndex = state.tours.findIndex(tour => tour.id === action.payload.id);
      state.tours[tourIndex] = action.payload;
      state.loading = RequestStatus.SUCCESSFUL;
      state.error = null;
    },
  },
});

export const {
  notificationsTourRequest,
  fetchNotificationsToursSuccess,
  notificationsToursRequestError,
  updateNotificationsTourSuccess,
} = userNotificationsToursSlice.actions;

export const toursReducer = userNotificationsToursSlice.reducer;
