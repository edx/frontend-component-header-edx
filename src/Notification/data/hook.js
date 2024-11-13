import {
  useContext, useCallback, useEffect, useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { camelCaseObject } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import { breakpoints, useWindowSize } from '@openedx/paragon';
import { RequestStatus } from './constants';
import { notificationsContext } from '../context/notificationsContext';
import {
  getNotificationsList, getNotificationCounts, markNotificationSeen, markAllNotificationRead, markNotificationRead,
} from './api';

export function useIsOnMediumScreen() {
  const windowSize = useWindowSize();
  return breakpoints.large.maxWidth > windowSize.width && windowSize.width >= breakpoints.medium.minWidth;
}

export function useIsOnLargeScreen() {
  const windowSize = useWindowSize();
  return windowSize.width >= breakpoints.extraLarge.minWidth;
}

export function useNotification() {
  const {
    appName, apps, tabsCount, notifications, updateNotificationData,
  } = useContext(notificationsContext);

  const normalizeNotificationCounts = useCallback(({ countByAppName, ...countData }) => {
    const appIds = Object.keys(countByAppName);
    const notificationApps = appIds.reduce((acc, appId) => { acc[appId] = []; return acc; }, {});

    return {
      ...countData,
      appIds,
      notificationApps,
      countByAppName,
    };
  }, []);

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

  const getNotifications = useCallback(() => {
    try {
      const notificationIds = apps[appName] || [];

      return notificationIds.map((notificationId) => notifications[notificationId]) || [];
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [apps, appName, notifications]);

  const fetchAppsNotificationCount = useCallback(async () => {
    try {
      const data = await getNotificationCounts();
      const normalisedData = normalizeNotificationCounts(camelCaseObject(data));

      const {
        countByAppName, appIds, notificationApps, count, showNotificationsTray, notificationExpiryDays,
        isNewNotificationViewEnabled,
      } = normalisedData;

      return {
        tabsCount: { count, ...countByAppName },
        appsId: appIds,
        apps: notificationApps,
        showNotificationsTray,
        notificationStatus: RequestStatus.SUCCESSFUL,
        notificationExpiryDays,
        isNewNotificationViewEnabled,
      };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [normalizeNotificationCounts]);

  const fetchNotificationList = useCallback(async (app, page = 1, pageSize = 10, trayOpened = true) => {
    try {
      updateNotificationData({ notificationListStatus: RequestStatus.IN_PROGRESS });
      const data = await getNotificationsList(app, page, pageSize, trayOpened);
      const normalizedData = normalizeNotifications((camelCaseObject(data)));

      const {
        newNotificationIds, notificationsKeyValuePair, pagination,
      } = normalizedData;

      const existingNotificationIds = apps[appName] || [];
      const { count } = tabsCount;

      return {
        apps: {
          ...apps,
          [appName]: Array.from(new Set([...existingNotificationIds, ...newNotificationIds])),
        },
        notifications: { ...notifications, ...notificationsKeyValuePair },
        tabsCount: {
          ...tabsCount,
          count: count - tabsCount[appName],
          [appName]: 0,
        },
        notificationListStatus: RequestStatus.SUCCESSFUL,
        pagination,
      };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [appName, apps, tabsCount, notifications, updateNotificationData]);

  const markNotificationsAsSeen = useCallback(async (app) => {
    try {
      await markNotificationSeen(app);

      return { notificationStatus: RequestStatus.SUCCESSFUL };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async (app) => {
    try {
      await markAllNotificationRead(app);
      const updatedNotifications = Object.fromEntries(
        Object.entries(notifications).map(([key, notification]) => [
          key, { ...notification, lastRead: new Date().toISOString() },
        ]),
      );

      return {
        notifications: updatedNotifications,
        notificationStatus: RequestStatus.SUCCESSFUL,
      };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [notifications]);

  const markNotificationsAsRead = useCallback(async (notificationId) => {
    try {
      const data = camelCaseObject(await markNotificationRead(notificationId));

      const date = new Date().toISOString();
      const notificationList = { ...notifications };
      notificationList[data.id] = { ...notifications[data.id], lastRead: date };

      return {
        notifications: notificationList,
        notificationStatus: RequestStatus.SUCCESSFUL,
      };
    } catch (error) {
      return { notificationStatus: RequestStatus.FAILED };
    }
  }, [notifications]);

  return {
    fetchAppsNotificationCount,
    fetchNotificationList,
    getNotifications,
    markNotificationsAsSeen,
    markAllNotificationsAsRead,
    markNotificationsAsRead,
  };
}

export function useAppNotifications() {
  const { authenticatedUser } = useContext(AppContext);
  const [isNewNotificationView, setIsNewNotificationView] = useState(false);
  const [notificationAppData, setNotificationAppData] = useState();
  const { fetchAppsNotificationCount } = useNotification();
  const location = useLocation();

  const fetchNotificationData = useCallback(async () => {
    const data = await fetchAppsNotificationCount();
    const { isNewNotificationViewEnabled } = data;

    setIsNewNotificationView(isNewNotificationViewEnabled);
    setNotificationAppData(data);
  }, [fetchAppsNotificationCount]);

  useEffect(() => {
    const fetchNotifications = async () => {
      await fetchNotificationData();
    };
    if (authenticatedUser) {
      fetchNotifications();
    }
  }, [fetchNotificationData, authenticatedUser, location.pathname]);

  return {
    isNewNotificationView,
    notificationAppData,
  };
}
