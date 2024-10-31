import { getConfig } from '@edx/frontend-platform';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';

// create constant for the API URL
export const getDiscussionTourUrl = () => `${getConfig().LMS_BASE_URL}/api/user_tours/discussion_tours/`;

export async function getNotificationsTours() {
  const { data } = await getAuthenticatedHttpClient().get(getDiscussionTourUrl());
  return data;
}

export async function updateNotificationsTour(tourId) {
  const { data } = await getAuthenticatedHttpClient().put(`${getDiscussionTourUrl()}${tourId}`, { show_tour: false });
  return data;
}
