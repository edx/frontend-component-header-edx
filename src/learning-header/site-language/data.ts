// Helper functions to handle loading and setting the site language setting

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

/**
 * Get the cookies from the document.
 *
 * @returns {Record<string, string>} An object representing the cookies.
 */
function getCookies(): Record<string, string> {
  const cookies = document.cookie.split(';');
  const cookieObj = {};

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    const parts = cookie.split('=');
    const key = parts[0];
    const value = parts.slice(1).join('=');
    try {
      cookieObj[key] = decodeURIComponent(value);
    } catch (e) {
      cookieObj[key] = value;
    }
  }
  return cookieObj;
}

/**
 * Get the site language from cookies.
 *
 * @returns {string} The site language code.
 */
export function getSiteLanguage(): string {
  const cookies = getCookies();
  return cookies[getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME] || 'en';
}

/**
 *  Patch the user's language preferences.
 *
 * @param username - The username of the user.
 * @param languageCode - The new language code to set.
 */
async function patchPreferences(username: string, languageCode: string): Promise<void> {
  // Make a patch request to update user preferences
  const requestConfig = { headers: { 'Content-Type': 'application/merge-patch+json' } };
  const requestUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${username}`;

  await getAuthenticatedHttpClient().patch(requestUrl, { 'pref-lang': languageCode }, requestConfig);
}

/**
 * Post the new language code to the django i18n API.
 *
 * @param languageCode - The new language code to set.
 */
async function postSetLang(languageCode: string): Promise<void> {
  const formData = new FormData();
  const requestConfig = {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
  };
  const url = `${getConfig().LMS_BASE_URL}/i18n/setlang/`;
  formData.append('language', languageCode);

  await getAuthenticatedHttpClient().post(url, formData, requestConfig);
}

/**
 * Set the site language for the user by making API calls to the user preferences API
 * and the django i18n API.
 *
 * @param languageCode - The new language code to set.
 * @param username - The username of the user.
 */
export async function setSiteLanguage(languageCode: string, username: string): Promise<void> {
  // Update the user's language preference by making API calls to the
  // user preferences API and the i18n API
  await patchPreferences(username, languageCode);
  await postSetLang(languageCode);
}

/**
 * Fetch the toggle state for unified translations for a course.
 *
 * @param courseId - The ID of the course.
 * @returns A promise that resolves to a boolean indicating whether the feature is enabled.
 */
export async function fetchToggleEnabled(courseId: string): Promise<boolean> {
  const url = `${getConfig().LMS_BASE_URL}/courses/${courseId}/unified-translations/enabled/`;
  return getAuthenticatedHttpClient()
    .get(url)
    .then(response => response.data.enabled)
    .catch((error) => {
      logError('Failed to fetch unified translations toggle state', { courseId, error });
      return false;
    });
}
