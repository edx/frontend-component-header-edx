import {
  QuestionAnswerOutline, PostOutline,
} from '@edx/paragon/icons';

/**
 * Get HTTP Error status from generic error.
 * @param error Generic caught error.
 * @returns {number|null}
 */
export const getHttpErrorStatus = error => error?.customAttributes?.httpErrorStatus ?? error?.response?.status;

export const splitNotificationsByTime = (notificationList) => {
  let splittedData = [];
  if (notificationList.length > 0) {
    const currentTime = Date.now();
    const twentyFourHoursAgo = currentTime - (24 * 60 * 60 * 1000);

    splittedData = notificationList.reduce(
      (result, notification) => {
        if (notification) {
          const objectTime = new Date(notification.createdAt).getTime();
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
