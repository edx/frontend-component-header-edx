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
  notificationTourPreferenceBody: {
    id: 'notification.tour.preference.body',
    defaultMessage: 'Click the bell icon to see Discussion notifications and customize your preferences by clicking on the gear icon.',
    description: 'Body of the tour for the notification preferences',
  },
  notificationTourGuideBody: {
    id: 'notification.tour.guide.body',
    defaultMessage: 'Certain notifications are enabled by default, as further detailed in the ',
    description: 'Body of the tour for the notification for the guide',
  },
  notificationTourGuideLink: {
    id: 'notification.tour.guide.link',
    defaultMessage: "edX Learner's Guide.",
    description: 'Link of the tour for the notification for the guide',
  },
  notificationTourTitle: {
    id: 'notification.tour.title',
    defaultMessage: 'Stay informed!',
    description: 'Title of the notification tour',
  },
});

export default messages;
