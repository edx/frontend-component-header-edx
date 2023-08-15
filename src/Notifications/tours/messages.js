import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  notificationTourId: {
    id: 'notification.tour.id',
    defaultMessage: 'notification_tour',
    description: 'Notification Tour Id',
  },
  dismissButtonText: {
    id: 'tour.action.dismiss',
    defaultMessage: 'Dismiss',
    description: 'Action to dismiss current tour',
  },
  endButtonText: {
    id: 'tour.action.end',
    defaultMessage: 'Okay',
    description: 'Action to end current tour',
  },
  notificationTourBody: {
    id: 'notification.tour.body',
    defaultMessage: 'Click the bell icon to see Discussion notifications and customize your preferences by clicking on the gear icon',
    description: 'Body of the tour for the notification',
  },
  notificationTourTitle: {
    id: 'notification.tour.title',
    defaultMessage: 'Stay informed!',
    description: 'Title of the notification tour',
  },
});

export default messages;
