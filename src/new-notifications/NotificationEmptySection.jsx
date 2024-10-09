import React, { useContext } from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon, IconButton } from '@openedx/paragon';
import { NotificationsNone } from '@openedx/paragon/icons';

import NotificationPopoverContext from './context/notificationPopoverContext';
import messages from './messages';

const EmptyNotifications = () => {
  const intl = useIntl();
  const { popoverHeaderRef, notificationRef } = useContext(NotificationPopoverContext);

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      data-testid="notifications-empty-list"
      style={{ height: `${notificationRef.current.clientHeight - popoverHeaderRef.current.clientHeight}px` }}
    >
      <IconButton
        isActive
        alt={intl.formatMessage(messages.notificationBellIconAltMessage)}
        src={NotificationsNone}
        iconAs={Icon}
        variant="light"
        iconClassNames="text-primary-500"
        className="ml-4 mr-1 notification-button notification-lg-bell-icon pl-2"
        data-testid="notification-bell-icon"
      />
      <div className="mx-auto mt-3.5 mb-3 font-size-22 notification-end-title line-height-24">
        {intl.formatMessage(messages.noNotificationsYetMessage)}
      </div>
      <div className="d-flex flex-row mx-auto text-gray-500">
        <span className="font-size-14 line-height-normal">
          {intl.formatMessage(messages.noNotificationHelpMessage)}
        </span>
      </div>
    </div>
  );
};

export default React.memo(EmptyNotifications);
