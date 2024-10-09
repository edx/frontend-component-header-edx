/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const RequestStatus = {
  IDLE: 'idle',
  IN_PROGRESS: 'in-progress',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
};

const initialState = {
  notificationStatus: RequestStatus.IDLE,
  notificationListStatus: RequestStatus.IDLE,
  appName: 'discussion',
  appsId: [],
  apps: {},
  notifications: {},
  tabsCount: {},
  showNotificationsTray: false,
  pagination: {},
  trayOpened: false,
  isNewNotificationViewEnabled: false,
};
const slice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notificationStatusRequest: (state) => {
      state.notificationStatus = RequestStatus.IN_PROGRESS;
    },
    notificationStatusFailed: (state) => {
      state.notificationStatus = RequestStatus.FAILED;
    },
    notificationStatusSuccess: (state) => {
      state.notificationStatus = RequestStatus.SUCCESSFUL;
    },
    notificationListStatusRequest: (state) => {
      state.notificationListStatus = RequestStatus.IN_PROGRESS;
    },
    notificationListStatusFailed: (state) => {
      state.notificationListStatus = RequestStatus.FAILED;
    },
    fetchNotificationSuccess: (state, { payload }) => {
      const {
        newNotificationIds, notificationsKeyValuePair, pagination,
      } = payload;
      const existingNotificationIds = state.apps[state.appName];
      state.apps[state.appName] = Array.from(new Set([...existingNotificationIds, ...newNotificationIds]));
      state.notifications = { ...state.notifications, ...notificationsKeyValuePair };
      state.tabsCount.count -= state.tabsCount[state.appName];
      state.tabsCount[state.appName] = 0;
      state.notificationListStatus = RequestStatus.SUCCESSFUL;
      state.pagination = pagination;
    },
    fetchNotificationsCountSuccess: (state, { payload }) => {
      const {
        countByAppName, appIds, apps, count, showNotificationsTray, notificationExpiryDays,
        isNewNotificationViewEnabled,
      } = payload;
      state.tabsCount = { count, ...countByAppName };
      state.appsId = appIds;
      state.apps = apps;
      state.showNotificationsTray = showNotificationsTray;
      state.notificationStatus = RequestStatus.SUCCESSFUL;
      state.notificationExpiryDays = notificationExpiryDays;
      state.isNewNotificationViewEnabled = isNewNotificationViewEnabled;
    },
    markAllNotificationsAsReadSuccess: (state) => {
      const updatedNotifications = Object.fromEntries(
        Object.entries(state.notifications).map(([key, notification]) => [
          key, { ...notification, lastRead: new Date().toISOString() },
        ]),
      );
      state.notifications = updatedNotifications;
      state.notificationStatus = RequestStatus.SUCCESSFUL;
    },
    markNotificationsAsReadSuccess: (state, { payload }) => {
      const date = new Date().toISOString();
      state.notifications[payload.id] = { ...state.notifications[payload.id], lastRead: date };
      state.notificationStatus = RequestStatus.SUCCESSFUL;
    },
    markNotificationsAsSeenSuccess: (state) => {
      state.notificationStatus = RequestStatus.SUCCESSFUL;
    },
    updateAppNameRequest: (state, { payload }) => {
      state.appName = payload.appName;
      state.pagination.currentPage = 1;
    },
    resetNotificationStateRequest: () => initialState,
    toggleTrayEvent: (state, { payload }) => {
      state.trayOpened = payload;
    },
  },
});

export const {
  notificationStatusRequest,
  notificationStatusFailed,
  notificationStatusSuccess,
  notificationListStatusFailed,
  notificationListStatusRequest,
  fetchNotificationSuccess,
  fetchNotificationsCountSuccess,
  markAllNotificationsAsReadSuccess,
  markNotificationsAsReadSuccess,
  markNotificationsAsSeenSuccess,
  updateAppNameRequest,
  resetNotificationStateRequest,
  toggleTrayEvent,
} = slice.actions;

export const notificationsReducer = slice.reducer;
