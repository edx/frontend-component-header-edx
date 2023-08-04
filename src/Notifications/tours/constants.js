/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import { Icon, Hyperlink } from '@edx/paragon';
import { Settings } from '@edx/paragon/icons';
import { getConfig } from '@edx/frontend-platform';
import messages from './messages';

export default function tourCheckpoints(intl) {
  return {
    NOTIFICATION_TOUR: [
      {
        body: (
          <>
            {intl.formatMessage(messages.notificationTourBody)}
            <Hyperlink
              destination={`${getConfig().ACCOUNT_SETTINGS_URL}/notifications`}
              target="_blank"
              rel="noopener noreferrer"
              showLaunchIcon={false}
              className="d-inline-block pl-1.5"
            >
              <Icon
                src={Settings}
                className="icon-size-20 text-primary-500"
                data-testid="tour-setting-icon"
                screenReaderText="preferences settings icon"
              />
            </Hyperlink>
          </>
        ),
        placement: 'left',
        target: '#bell-icon',
        title: intl.formatMessage(messages.notificationTourTitle),
      },
    ],
  };
}
