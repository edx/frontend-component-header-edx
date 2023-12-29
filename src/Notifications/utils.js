import { useEffect } from 'react';

import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';
import { QuestionAnswerOutline, PostOutline } from '@openedx/paragon/icons';

export const splitNotificationsByTime = (notificationList) => {
  let splittedData = [];
  if (notificationList.length > 0) {
    const currentTime = Date.now();
    const twentyFourHoursAgo = currentTime - (24 * 60 * 60 * 1000);

    splittedData = notificationList.reduce(
      (result, notification) => {
        if (notification) {
          const objectTime = new Date(notification.created).getTime();
          if (objectTime >= twentyFourHoursAgo && objectTime <= currentTime) {
            result.today.push(notification);
          } else {
            result.earlier.push(notification);
          }
        }
        return result;
      },
      { today: [], earlier: [] },
    );
  }
  const { today, earlier } = splittedData;
  return { today, earlier };
};

export const getIconByType = (type) => {
  const iconMap = {
    new_response: { icon: QuestionAnswerOutline, class: 'text-primary-500' },
    new_comment: { icon: QuestionAnswerOutline, class: 'text-primary-500' },
    new_comment_on_response: { icon: QuestionAnswerOutline, class: 'text-primary-500' },
  };
  return iconMap[type] || { icon: PostOutline, class: 'text-primary-500' };
};

export function useFeedbackWrapper() {
  useEffect(() => {
    try {
      const url = getConfig().NOTIFICATION_FEEDBACK_URL;
      if (url) {
        // eslint-disable-next-line no-undef
        window.usabilla_live = lightningjs.require('usabilla_live', getConfig().NOTIFICATION_FEEDBACK_URL);
        window.usabilla_live('hide');
      }
    } catch (error) {
      logError('Error loading usabilla_live in notificationTray', error);
    }
  }, []);
}
