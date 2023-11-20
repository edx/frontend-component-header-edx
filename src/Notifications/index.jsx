/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback, useEffect, useMemo,
  useRef, useState,
} from 'react';

import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Bubble,
  Button, Hyperlink, Icon, IconButton, OverlayTrigger, Popover,
} from '@edx/paragon';
import { NotificationsNone, Settings } from '@edx/paragon/icons';

import './notification.scss';
import { useIsOnLargeScreen, useIsOnMediumScreen } from './data/hook';
import { selectNotificationTabsCount } from './data/selectors';
import { toggleTrayEvent } from './data/slice';
import { resetNotificationState } from './data/thunks';
import NotificationTour from './tours/NotificationTour';
import NotificationContext from './context';
import messages from './messages';
import NotificationTabs from './NotificationTabs';

const Notifications = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const popoverRef = useRef(null);
  const headerRef = useRef(null);
  const buttonRef = useRef(null);
  const [enableNotificationTray, setEnableNotificationTray] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const notificationCounts = useSelector(selectNotificationTabsCount);
  const isOnMediumScreen = useIsOnMediumScreen();
  const isOnLargeScreen = useIsOnLargeScreen();

  const toggleNotificationTray = useCallback(() => {
    setEnableNotificationTray(prevState => !prevState);
    dispatch(toggleTrayEvent(!enableNotificationTray));
  }, [enableNotificationTray]);

  const handleClickOutsideNotificationTray = useCallback((event) => {
    if (!popoverRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target)) {
      setEnableNotificationTray(false);
      dispatch(toggleTrayEvent(false));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderVisible(window.scrollY < 100);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutsideNotificationTray);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotificationTray);
      window.removeEventListener('scroll', handleScroll);
      dispatch(resetNotificationState());
    };
  }, []);

  const enableFeedback = useCallback(() => {
    window.usabilla_live('click');
  }, []);

  const notificationRefs = useMemo(
    () => ({ popoverHeaderRef: headerRef, notificationRef: popoverRef }),
    [headerRef, popoverRef],
  );

  return (
    <>
      <OverlayTrigger
        trigger="click"
        key="bottom"
        placement="bottom"
        id="notificationTray"
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
                  className={`d-flex justify-content-between p-4 m-0 border-0 text-primary-500 zIndex-2 font-size-18
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
            id="bell-icon"
            iconClassNames="text-primary-500"
            className="ml-4 mr-1 notification-button"
            data-testid="notification-bell-icon"
          />
          {notificationCounts?.count > 0 && (
          <Bubble
            variant="error"
            data-testid="notification-count"
            className={classNames('notification-badge zindex-1 cursor-pointer', {
              'notification-badge-unrounded': notificationCounts.count >= 10,
              'notification-badge-rounded': notificationCounts.count < 10,
            })}
            onClick={toggleNotificationTray}
          >
            {notificationCounts.count >= 100 ? <div className="d-flex">99<p className="mb-0 plus-icon">+</p></div>
              : notificationCounts.count}
          </Bubble>
          )}
        </div>
      </OverlayTrigger>
      <NotificationTour />
    </>
  );
};

export default Notifications;
