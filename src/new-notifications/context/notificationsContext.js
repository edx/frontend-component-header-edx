import React from 'react';
import { RequestStatus } from '../data/constants';

export const initialState = {
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
};

export const notificationsContext = React.createContext(initialState);
