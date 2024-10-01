/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback, useEffect, useMemo,
  useRef, useState,
} from 'react';

import classNames from 'classnames';
import PropTypes from 'prop-types';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Bubble, Button, Hyperlink, Icon, IconButton, OverlayTrigger, Popover,
} from '@openedx/paragon';
import { NotificationsNone, Settings } from '@openedx/paragon/icons';
import { RequestStatus } from './data/constants';

import { useIsOnLargeScreen, useIsOnMediumScreen } from './data/hook';
import NotificationTour from './tours/NotificationTour';
import NotificationContext from './context';
import messages from './messages';
import NotificationTabs from './NotificationTabs';
import { HeaderContext } from '../common/context';

import './notification.scss';

const Notifications = ({ notificationAppData, showLeftMargin }) => {
  const intl = useIntl();
  const popoverRef = useRef(null);
  const headerRef = useRef(null);
  const buttonRef = useRef(null);
  const [enableNotificationTray, setEnableNotificationTray] = useState(false);
  const [appName, setAppName] = useState('discussion');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [notificationData, setNotificationData] = useState({});
  const [tabsCount, setTabsCount] = useState(notificationAppData?.tabsCount);
  const isOnMediumScreen = useIsOnMediumScreen();
  const isOnLargeScreen = useIsOnLargeScreen();

  const toggleNotificationTray = useCallback(() => {
    setEnableNotificationTray(prevState => !prevState);
  }, [enableNotificationTray]);

  const handleClickOutsideNotificationTray = useCallback((event) => {
    if (!popoverRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
      setEnableNotificationTray(false);
    }
  }, []);

  useEffect(() => {
    setTabsCount(notificationAppData.tabsCount);
    setNotificationData(prevData => ({
      ...prevData,
      ...notificationAppData,
    }));
  }, [notificationAppData]);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutsideNotificationTray);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotificationTray);
      window.removeEventListener('scroll', handleScroll);
      setAppName('discussion');
    };
  }, []);

  const enableFeedback = useCallback(() => {
    window.usabilla_live('click');
  }, []);

  const notificationRefs = useMemo(
    () => ({ popoverHeaderRef: headerRef, notificationRef: popoverRef }),
    [headerRef, popoverRef],
  );

  const handleActiveTab = useCallback((selectedAppName) => {
    setAppName(selectedAppName);
    setNotificationData(prevData => ({
      ...prevData,
      ...{ notificationListStatus: RequestStatus.IDLE },
    }));
  }, []);

  const updateNotificationData = useCallback((data) => {
    setNotificationData(prevData => ({
      ...prevData,
      ...data,
    }));
    if (data.tabsCount) {
      setTabsCount(data?.tabsCount);
    }
  }, []);

  const headerContextValue = useMemo(() => ({
    enableNotificationTray,
    appName,
    handleActiveTab,
    updateNotificationData,
    ...notificationData,
  }));

  return (
    <HeaderContext.Provider value={headerContextValue}>
      <OverlayTrigger
        trigger="click"
        key="bottom"
        placement="bottom"
        show={enableNotificationTray}
        overlay={(
          <Popover
            id="notificationTray"
            data-testid="notification-tray"
            className={classNames('overflow-auto rounded-0 border-0 position-fixed', {
              'w-100': !isOnMediumScreen && !isOnLargeScreen,
              'medium-screen': isOnMediumScreen,
              'large-screen': isOnLargeScreen,
              'popover-margin-top height-100vh': !isHeaderVisible,
              'height-91vh ': isHeaderVisible,
            })}
          >
            <div ref={popoverRef} className="height-inherit">
              <div ref={headerRef}>
                <Popover.Title
                  as="h2"
                  className={`d-flex justify-content-between px-4 pt-4 pb-14px m-0 border-0 text-primary-500 zIndex-2 font-size-18
                  line-height-24 bg-white position-sticky`}
                >
                  {intl.formatMessage(messages.notificationTitle)}
                  <Hyperlink
                    destination={`${getConfig().ACCOUNT_SETTINGS_URL}/notifications`}
                    target="_blank"
                    rel="noopener noreferrer"
                    showLaunchIcon={false}
                  >
                    <Icon
                      src={Settings}
                      className="icon-size-20 text-primary-500"
                      data-testid="setting-icon"
                      screenReaderText="preferences settings icon"
                    />
                  </Hyperlink>
                </Popover.Title>
              </div>
              <Popover.Content className="notification-content p-0">
                <NotificationContext.Provider value={notificationRefs}>
                  <NotificationTabs />
                </NotificationContext.Provider>
              </Popover.Content>
              {getConfig().NOTIFICATION_FEEDBACK_URL && (
                <Button
                  onClick={enableFeedback}
                  variant="warning"
                  className="notification-feedback-widget"
                  alt="feedback button"
                >
                  {intl.formatMessage(messages.feedback)}
                </Button>
              )}
            </div>
          </Popover>
        )}
      >
        <div ref={buttonRef} id="notificationIcon">
          <IconButton
            isActive={enableNotificationTray}
            alt={intl.formatMessage(messages.notificationBellIconAltMessage)}
            onClick={toggleNotificationTray}
            src={NotificationsNone}
            iconAs={Icon}
            variant="light"
            iconClassNames="text-primary-500"
            className={classNames('mr-1 notification-button', {
              'ml-4': showLeftMargin,
            })}
            data-testid="notification-bell-icon"
          />
          {tabsCount?.count > 0 && (
          <Bubble
            variant="error"
            data-testid="notification-count"
            className={classNames('notification-badge zindex-1 cursor-pointer', {
              'notification-badge-unrounded': tabsCount.count >= 10,
              'notification-badge-rounded': tabsCount.count < 10,
            })}
            onClick={toggleNotificationTray}
          >
            {tabsCount.count >= 100 ? <div className="d-flex">99<p className="mb-0 plus-icon">+</p></div>
              : tabsCount.count}
          </Bubble>
          )}
        </div>
      </OverlayTrigger>
      <NotificationTour />
    </HeaderContext.Provider>
  );
};

Notifications.propTypes = {
  showLeftMargin: PropTypes.bool,
  notificationAppData: {
    apps: PropTypes.object.isRequired,
    appsId: PropTypes.arrayOf(PropTypes.string).isRequired, // Array of strings
    isNewNotificationViewEnabled: PropTypes.bool.isRequired, // Boolean
    notificationExpiryDays: PropTypes.number.isRequired, // Number
    notificationStatus: PropTypes.string.isRequired, // String
    showNotificationsTray: PropTypes.bool.isRequired, // Boolean
    tabsCount: PropTypes.shape({
      count: PropTypes.number.isRequired, // Assuming count is a number
    }).isRequired,
  },
};

Notifications.defaultProps = {
  showLeftMargin: true,
  notificationAppData: {
    apps: { },
    tabsCount: { },
    appsId: [],
    isNewNotificationViewEnabled: false,
    notificationExpiryDays: 0,
    notificationStatus: '',
    showNotificationsTray: false,
  },
};

export default Notifications;
