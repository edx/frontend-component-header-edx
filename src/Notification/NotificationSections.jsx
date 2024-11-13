import React, { useCallback, useContext, useMemo } from 'react';

import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Icon, Spinner } from '@openedx/paragon';
import { AutoAwesome, CheckCircleLightOutline } from '@openedx/paragon/icons';

import { RequestStatus } from './data/constants';
import NotificationPopoverContext from './context/notificationPopoverContext';
import messages from './messages';
import NotificationEmptySection from './NotificationEmptySection';
import NotificationRowItem from './NotificationRowItem';
import { splitNotificationsByTime } from './utils';
import { notificationsContext } from './context/notificationsContext';
import { useNotification } from './data/hook';

const NotificationSections = () => {
  const intl = useIntl();
  const {
    appName, notificationListStatus, pagination,
    notificationExpiryDays, appsId, updateNotificationData,
  } = useContext(notificationsContext);
  const { getNotifications, markAllNotificationsAsRead, fetchNotificationList } = useNotification();
  const notificationList = getNotifications();
  const { hasMorePages, currentPage } = pagination || {};
  const { popoverHeaderRef, notificationRef } = useContext(NotificationPopoverContext);
  const { today = [], earlier = [] } = useMemo(
    () => splitNotificationsByTime(notificationList),
    [notificationList],
  );

  const handleMarkAllAsRead = useCallback(async () => {
    const data = await markAllNotificationsAsRead(appName);
    updateNotificationData(data);
  }, [appName, markAllNotificationsAsRead, updateNotificationData]);

  const loadMoreNotifications = useCallback(async () => {
    const data = await fetchNotificationList(appName, currentPage + 1);
    updateNotificationData(data);
  }, [fetchNotificationList, appName, currentPage, updateNotificationData]);

  const renderNotificationSection = (section, items) => {
    if (isEmpty(items)) { return null; }

    return (
      <div className="pb-2">
        <div className="d-flex justify-content-between align-items-center py-2 mb-2">
          <span className="text-gray-500 line-height-10">
            {section === 'today' && intl.formatMessage(messages.notificationTodayHeading)}
            {section === 'earlier' && intl.formatMessage(messages.notificationEarlierHeading)}
          </span>
          {notificationList?.length > 0 && (section === 'earlier' ? today.length === 0 : true) && (
            <Button
              variant="link"
              className="small line-height-10 text-decoration-none p-0 border-0 text-info-500"
              onClick={handleMarkAllAsRead}
              size="sm"
              data-testid="mark-all-read"
            >
              {intl.formatMessage(messages.notificationMarkAsRead)}
            </Button>
          )}
        </div>
        {items.map((notification) => (
          <NotificationRowItem
            key={notification.id}
            id={notification.id}
            type={notification.notificationType}
            contentUrl={notification.contentUrl}
            content={notification.content}
            courseName={notification.contentContext?.courseName || ''}
            createdAt={notification.created}
            lastRead={notification.lastRead}
          />
        ))}
      </div>
    );
  };

  const shouldRenderEmptyNotifications = notificationList?.length === 0
    && notificationListStatus === RequestStatus.SUCCESSFUL
    && notificationRef?.current
    && popoverHeaderRef?.current;

  return (
    <div
      className={classNames('px-4', {
        'mt-4': appsId.length > 1,
        'pb-3.5': appsId.length > 0,
      })}
      data-testid="notification-tray-section"
    >
      {renderNotificationSection('today', today)}
      {renderNotificationSection('earlier', earlier)}
      {notificationListStatus === RequestStatus.IN_PROGRESS ? (
        <div className="d-flex justify-content-center p-4">
          <Spinner animation="border" variant="primary" size="lg" data-testid="notifications-loading-spinner" />
        </div>
      ) : (hasMorePages && notificationListStatus === RequestStatus.SUCCESSFUL && notificationList.length >= 10 && (
        <Button
          variant="primary"
          className="w-100 bg-primary-500"
          onClick={loadMoreNotifications}
          data-testid="load-more-notifications"
        >
          {intl.formatMessage(messages.loadMoreNotifications)}
        </Button>
      )
      )}
      {
        notificationList.length > 0 && !hasMorePages && notificationListStatus === RequestStatus.SUCCESSFUL && (
          <div
            className="d-flex flex-column my-5"
            data-testid="notifications-list-complete"
          >
            <Icon className="mx-auto icon-size-56" src={CheckCircleLightOutline} />
            <div className="mx-auto mb-3  mt-3.5 lead notification-end-title line-height-24">
              {intl.formatMessage(messages.allRecentNotificationsMessage)}
            </div>
            <div className="d-flex flex-row mx-auto text-gray-500">
              <Icon src={AutoAwesome} />
              <span className="small line-height-normal">
                {intl.formatMessage(messages.expiredNotificationsDeleteMessage, { days: notificationExpiryDays })}
              </span>
            </div>
          </div>
        )
      }

      {shouldRenderEmptyNotifications && <NotificationEmptySection />}
    </div>
  );
};

export default React.memo(NotificationSections);
