/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import classNames from 'classnames';
import {
  Badge, Icon, IconButton, OverlayTrigger, Popover, Hyperlink, Tooltip,
} from '@edx/paragon';
import { NotificationsNone, Settings, Feedback } from '@edx/paragon/icons';
import { selectNotificationTabsCount } from './data/selectors';
import { resetNotificationState } from './data/thunks';
import { toggleTrayEvent } from './data/slice';
import { useIsOnLargeScreen, useIsOnMediumScreen } from './data/hook';
import NotificationTabs from './NotificationTabs';
import messages from './messages';
import NotificationTour from './tours/NotificationTour';

const Notifications = () => {
  const intl = useIntl();
  const dispatch = useDispatch();
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);
  const [enableNotificationTray, setEnableNotificationTray] = useState(false);
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
    document.addEventListener('mousedown', handleClickOutsideNotificationTray);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideNotificationTray);
      dispatch(resetNotificationState());
    };
  }, []);

  const viewPortHeight = document.body.clientHeight;
  const headerHeight = document.getElementsByClassName('learning-header-container');
  const footer = document.getElementsByClassName('footer');
  let notificationBarHeight = 0;

  if (headerHeight.length > 0) {
    notificationBarHeight = viewPortHeight - headerHeight[0].clientHeight;
    if (footer.length > 0) {
      notificationBarHeight -= footer[0].clientHeight;
    }
  }

  const enableFeedback = useCallback(() => {
    window.usabilla_live('click');
  }, []);

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
            style={{ height: `${notificationBarHeight}px` }}
            data-testid="notification-tray"
            className={classNames('overflow-auto rounded-0 border-0', {
              'w-100': !isOnMediumScreen && !isOnLargeScreen,
              'medium-screen': isOnMediumScreen,
              'large-screen': isOnLargeScreen,
            })}
          >
            <div ref={popoverRef}>
              <Popover.Title as="h2" className="d-flex justify-content-between p-0 m-4 border-0 text-primary-500 font-size-18 line-height-24">
                {intl.formatMessage(messages.notificationTitle)}
                {getConfig().NOTIFICATION_FEEDBACK_URL && (
                  <OverlayTrigger
                    overlay={(
                      <Tooltip id="feedback-icon">
                        {intl.formatMessage(messages.feedback)}
                      </Tooltip>
                    )}
                  >
                    <Icon
                      onClick={() => enableFeedback()}
                      src={Feedback}
                      className="icon-size-20 text-primary-500 cursor-pointer ml-1 mr-auto"
                      screenReaderText="feedback icon"
                    />
                  </OverlayTrigger>
                )}
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
              <Popover.Content className="notification-content p-0">
                <NotificationTabs />
              </Popover.Content>
            </div>
          </Popover>
        )}
      >
        <div ref={buttonRef}>
          <IconButton
            isActive={enableNotificationTray}
            alt="notification bell icon"
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
          <Badge
            pill
            variant="danger"
            className="zindex-1"
            data-testid="notification-count"
            bsPrefix="notification-badge"
          >
            {notificationCounts.count >= 100 ? <div className="d-flex">99<p className="mb-0 plus-icon">+</p></div>
              : notificationCounts.count}
          </Badge>
          )}
        </div>
      </OverlayTrigger>
      <NotificationTour />
    </>
  );
};

export default Notifications;
