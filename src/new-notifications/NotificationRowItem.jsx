import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';

import * as timeago from 'timeago.js';

import { useIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@openedx/paragon';

import messages from './messages';
import timeLocale from '../common/time-locale';
import { getIconByType } from './utils';
import { useNotification } from './data/hook';
import { HeaderContext } from '../common/context';

const NotificationRowItem = ({
  id, type, contentUrl, content, courseName, createdAt, lastRead,
}) => {
  timeago.register('time-locale', timeLocale);
  const intl = useIntl();
  const { markNotificationsAsRead } = useNotification();
  const { updateNotificationData } = useContext(HeaderContext);

  const handleMarkAsRead = useCallback(async () => {
    if (!lastRead) {
      const data = await markNotificationsAsRead(id);
      updateNotificationData(data);
    }
  }, [id, lastRead, markNotificationsAsRead, updateNotificationData]);

  const { icon: iconComponent, class: iconClass } = getIconByType(type);

  return (
    <a
      target="_blank"
      className="d-flex mb-2 align-items-center text-decoration-none"
      href={contentUrl}
      onClick={handleMarkAsRead}
      data-testid={`notification-${id}`}
      rel="noopener noreferrer"
    >
      <Icon
        src={iconComponent}
        className={`${iconClass} mr-4 notification-icon`}
        data-testid={`notification-icon-${id}`}
      />
      <div className="d-flex w-100" data-testid="notification-contents">
        <div className="d-flex align-items-center w-100">
          <div className="py-10px w-100 px-0 cursor-pointer">
            <span
              className="line-height-24 text-gray-700 mb-2 notification-item-content overflow-hidden content"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: content }}
              data-testid={`notification-content-${id}`}
            />
            <div className="py-0 d-flex">
              <span className="font-size-12 text-gray-500 line-height-20">
                <span data-testid={`notification-course-${id}`}>{courseName}
                </span>
                <span className="text-light-700 px-1.5">{intl.formatMessage(messages.fullStop)}</span>
                <span data-testid={`notification-created-date-${id}`}> {timeago.format(createdAt, 'time-locale')}
                </span>
              </span>
            </div>
          </div>
          {!lastRead && (
            <div className="d-flex py-1.5 px-1.5 ml-2 cursor-pointer">
              <span className="bg-brand-500 rounded unread" data-testid={`unread-notification-${id}`} />
            </div>
          )}
        </div>
      </div>
    </a>
  );
};

NotificationRowItem.propTypes = {
  id: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  contentUrl: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  courseName: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  lastRead: PropTypes.string.isRequired,
};

export default React.memo(NotificationRowItem);
