import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs } from '@edx/paragon';
import NotificationSections from './NotificationSections';
import { fetchNotificationList, markNotificationsAsSeen } from './data/thunks';
import {
  selectNotificationTabs, selectNotificationTabsCount, selectSelectedAppName,
} from './data/selectors';
import { updateAppNameRequest } from './data/slice';

const NotificationTabs = () => {
  const dispatch = useDispatch();
  const selectedAppName = useSelector(selectSelectedAppName);
  const notificationUnseenCounts = useSelector(selectNotificationTabsCount);
  const notificationTabs = useSelector(selectNotificationTabs);
  const [trayOpened, setTrayOpened] = useState(false);

  useEffect(() => {
    dispatch(fetchNotificationList({ appName: selectedAppName, trayOpened: !trayOpened }));
    if (notificationUnseenCounts[selectedAppName]) {
      dispatch(markNotificationsAsSeen(selectedAppName));
    }
    setTrayOpened(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAppName]);

  const handleActiveTab = useCallback((appName) => {
    dispatch(updateAppNameRequest({ appName }));
  }, [dispatch]);

  return (
    <Tabs
      variant="tabs"
      defaultActiveKey={selectedAppName}
      onSelect={handleActiveTab}
      className="px-2.5 text-primary-500"
    >
      {notificationTabs?.map((appName) => (
        <Tab
          key={appName}
          eventKey={appName}
          title={appName}
          notification={notificationUnseenCounts[appName]}
          tabClassName="pt-0 pb-10px px-2.5 d-flex border-top-0 mb-0 align-items-center line-height-24 text-capitalize"
          data-testid={`notification-tab-${appName}`}
        >
          {selectedAppName === appName && <NotificationSections />}
        </Tab>
      ))}
    </Tabs>
  );
};

export default React.memo(NotificationTabs);
