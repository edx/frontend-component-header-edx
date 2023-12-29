/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Icon, Hyperlink } from '@openedx/paragon';
import { Settings } from '@openedx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';

export default function tourCheckpoints(intl) {
  return {
    NOTIFICATION_TOUR: [
      {
        body: (
          <>
            <p>
              {intl.formatMessage(messages.notificationTourPreferenceBody)}
              <Hyperlink
                destination={`${getConfig().ACCOUNT_SETTINGS_URL}/notifications`}
                target="_blank"
                rel="noopener noreferrer"
                showLaunchIcon={false}
                className="d-inline-block px-1.5"
              >
                <Icon
                  src={Settings}
                  className="icon-size-20 text-primary-500"
                  data-testid="tour-setting-icon"
                  screenReaderText="preferences settings icon"
                />
              </Hyperlink>
            </p>
            <p>
              {intl.formatMessage(messages.notificationTourGuideBody)}
              <Hyperlink
                destination="https://edx.readthedocs.io/projects/open-edx-learner-guide/en/latest/sfd_notifications/managing_notifications.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                {intl.formatMessage(messages.notificationTourGuideLink)}
              </Hyperlink>
            </p>
          </>
        ),
        placement: 'left',
        target: '#bell-icon',
        title: intl.formatMessage(messages.notificationTourTitle),
      },
    ],
  };
}
