import { camelCaseObject } from '@edx/frontend-platform';
import {
  notificationStatusRequest,
  notificationStatusFailed,
  notificationStatusSuccess,
  fetchNotificationSuccess,
  fetchNotificationsCountSuccess,
  markAllNotificationsAsReadSuccess,
  markNotificationsAsReadSuccess,
  resetNotificationStateRequest,
  notificationListStatusRequest,
  notificationListStatusFailed,
} from './slice';
import {
  getNotificationsList, getNotificationCounts, markNotificationSeen, markAllNotificationRead, markNotificationRead,
} from './api';

const normalizeNotificationCounts = ({ countByAppName, count, showNotificationsTray }) => {
  const appIds = Object.keys(countByAppName);
  const apps = appIds.reduce((acc, appId) => { acc[appId] = []; return acc; }, {});
  return {
    countByAppName, appIds, apps, count, showNotificationsTray,
  };
};

const normalizeNotifications = (data) => {
  const newNotificationIds = data.results.map(notification => notification.id.toString());
  const notificationsKeyValuePair = data.results.reduce((acc, obj) => { acc[obj.id] = obj; return acc; }, {});
  const pagination = {
    numPages: data.numPages,
    currentPage: data.currentPage,
    hasMorePages: !!data.next,
  };
  return {
    newNotificationIds, notificationsKeyValuePair, pagination,
  };
};

export const fetchNotificationList = ({
  appName, page = 1, pageSize = 10, trayOpened,
}) => (
  async (dispatch) => {
    try {
      dispatch(notificationListStatusRequest());
      const data = await getNotificationsList(appName, page, pageSize, trayOpened);
      const normalizedData = normalizeNotifications((camelCaseObject(data)));
      dispatch(fetchNotificationSuccess({ ...normalizedData }));
    } catch (error) {
      dispatch(notificationListStatusFailed());
    }
  }
);

export const fetchAppsNotificationCount = () => (
  async (dispatch) => {
    try {
      dispatch(notificationStatusRequest());
      const data = await getNotificationCounts();
      const normalisedData = normalizeNotificationCounts((camelCaseObject(data)));
      dispatch(fetchNotificationsCountSuccess({ ...normalisedData }));
    } catch (error) {
      dispatch(notificationStatusFailed());
    }
  }
);

export const markAllNotificationsAsRead = (appName) => (
  async (dispatch) => {
    try {
      dispatch(notificationStatusRequest());
      const data = await markAllNotificationRead(appName);
      dispatch(markAllNotificationsAsReadSuccess(camelCaseObject(data)));
    } catch (error) {
      dispatch(notificationStatusFailed());
    }
  }
);

export const markNotificationsAsRead = (notificationId) => (
  async (dispatch) => {
    try {
      dispatch(notificationStatusRequest());
      const data = await markNotificationRead(notificationId);
      dispatch(markNotificationsAsReadSuccess(camelCaseObject(data)));
    } catch (error) {
      dispatch(notificationStatusFailed());
    }
  }
);

export const markNotificationsAsSeen = (appName) => (
  async (dispatch) => {
    try {
      dispatch(notificationStatusRequest());
      await markNotificationSeen(appName);
      dispatch(notificationStatusSuccess());
    } catch (error) {
      dispatch(notificationStatusFailed());
    }
  }
);

export const resetNotificationState = () => (
  async (dispatch) => { dispatch(resetNotificationStateRequest()); }
);
