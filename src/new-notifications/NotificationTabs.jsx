import React, { useEffect, useContext } from 'react';

import { Tab, Tabs } from '@openedx/paragon';

import NotificationSections from './NotificationSections';
import { useFeedbackWrapper } from './utils';
import { HeaderContext } from '../common/context';
import { useNotification } from './data/hook';

const NotificationTabs = () => {
  useFeedbackWrapper();
  const {
    appName, handleActiveTab, tabsCount, appsId, updateNotificationData,
  } = useContext(HeaderContext);
  const { fetchNotificationList, markNotificationsAsSeen } = useNotification();

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await fetchNotificationList(appName);
      updateNotificationData(data);
      if (tabsCount[appName]) {
        await markNotificationsAsSeen(appName);
      }
    };

    fetchNotifications();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appName]);

  return (
    appsId.length > 1
      ? (
        <Tabs
          variant="tabs"
          defaultActiveKey={appName}
          onSelect={handleActiveTab}
          className="px-2.5 text-primary-500 tabs position-sticky zIndex-2 bg-white"
        >
          {appsId?.map((app) => (
            <Tab
              key={app}
              eventKey={app}
              title={app}
              notification={tabsCount[app]}
              tabClassName="pt-0 py-10px px-2.5 d-flex border-top-0 mb-0 align-items-center line-height-24 text-capitalize"
              data-testid={`notification-tab-${app}`}
            >
              {appName === app && <NotificationSections />}
            </Tab>
          ))}
        </Tabs>
      )
      : <NotificationSections />
  );
};

export default React.memo(NotificationTabs);
