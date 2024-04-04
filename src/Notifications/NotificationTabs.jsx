import React, { useCallback, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Tab, Tabs } from '@openedx/paragon';

import {
  selectNotificationTabs, selectNotificationTabsCount, selectSelectedAppName, selectTrayOpened,
} from './data/selectors';
import { toggleTrayEvent, updateAppNameRequest } from './data/slice';
import { fetchNotificationList, markNotificationsAsSeen } from './data/thunks';
import NotificationSections from './NotificationSections';
import { useFeedbackWrapper } from './utils';

const NotificationTabs = () => {
  useFeedbackWrapper();
  const dispatch = useDispatch();
  const selectedAppName = useSelector(selectSelectedAppName);
  const notificationUnseenCounts = useSelector(selectNotificationTabsCount);
  const notificationTabs = useSelector(selectNotificationTabs);
  const trayOpened = useSelector(selectTrayOpened);

  useEffect(() => {
    dispatch(fetchNotificationList({ appName: selectedAppName, trayOpened }));
    if (notificationUnseenCounts[selectedAppName]) {
      dispatch(markNotificationsAsSeen(selectedAppName));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAppName]);

  const handleActiveTab = useCallback((appName) => {
    dispatch(updateAppNameRequest({ appName }));
    dispatch(toggleTrayEvent(false));
  }, [dispatch]);

  return (
    notificationTabs.length > 1
      ? (
        <Tabs
          variant="tabs"
          defaultActiveKey={selectedAppName}
          onSelect={handleActiveTab}
          className="px-2.5 text-primary-500 tabs position-sticky zIndex-2 bg-white"
        >
          {notificationTabs?.map((appName) => (
            <Tab
              key={appName}
              eventKey={appName}
              title={appName}
              notification={notificationUnseenCounts[appName]}
              tabClassName="pt-0 py-10px px-2.5 d-flex border-top-0 mb-0 align-items-center line-height-24 text-capitalize"
              data-testid={`notification-tab-${appName}`}
            >
              {selectedAppName === appName && <NotificationSections />}
            </Tab>
          ))}
        </Tabs>
      )
      : <NotificationSections />
  );
};

export default React.memo(NotificationTabs);
