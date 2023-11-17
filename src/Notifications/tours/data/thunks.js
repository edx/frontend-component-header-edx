import { camelCaseObject } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

import { getNotificationsTours, updateNotificationsTour } from './api';
import {
  notificationsTourRequest,
  notificationsToursRequestError,
  fetchNotificationsToursSuccess,
  updateNotificationsTourSuccess,
} from './slices';

function normaliseTourData(data) {
  return data.map(tour => ({ ...tour, enabled: true }));
}

/**
 * Action thunk to fetch the list of notification tours for the current user.
 * @returns {function} - Thunk that dispatches the request, success, and error actions.
 */
export function fetchNotificationTours() {
  return async (dispatch) => {
    try {
      dispatch(notificationsTourRequest());
      const data = await getNotificationsTours();
      dispatch(fetchNotificationsToursSuccess(camelCaseObject(normaliseTourData(data))));
    } catch (error) {
      dispatch(notificationsToursRequestError());
      logError(error);
    }
  };
}

/**
 * Action thunk to update the show_tour field for a specific notification tour for the current user.
 * @param {number} tourId - The ID of the tour to update.
 * @returns {function} - Thunk that dispatches the request, success, and error actions.
 */

export function updateTourShowStatus(tourId) {
  return async (dispatch) => {
    try {
      dispatch(notificationsTourRequest());
      const data = await updateNotificationsTour(tourId);
      dispatch(updateNotificationsTourSuccess(camelCaseObject(data)));
    } catch (error) {
      dispatch(notificationsToursRequestError());
      logError(error);
    }
  };
}
