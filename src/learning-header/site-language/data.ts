// Helper functions to handle loading and setting the site language setting

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

function getCookies(): Record<string, string> {
  // Parse the document cookies into an object
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

export function getSiteLanguage(): string {
  // Get the site language from cookies
  const cookies = getCookies();
  return cookies[getConfig().LANGUAGE_PREFERENCE_COOKIE_NAME] || 'en';
}

async function patchPreferences(username: string, languageCode: string): Promise<void> {
  // Make a patch request to update user preferences
  const requestConfig = { headers: { 'Content-Type': 'application/merge-patch+json' } };
  const requestUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${username}`;

  await getAuthenticatedHttpClient().patch(requestUrl, { 'pref-lang': languageCode }, requestConfig);
}

async function postSetLang(languageCode: string): Promise<void> {
  // Make a POST request to set the language
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

export async function setSiteLanguage(languageCode: string, username: string): Promise<void> {
  // Update the user's language preference by making API calls to the
  // user preferences API and the i18n API
  await patchPreferences(username, languageCode);
  await postSetLang(languageCode);
}

export async function fetchToggleEnabled(courseId: string): Promise<boolean> {
  const url = `${getConfig().LMS_BASE_URL}/courses/${courseId}/unified-translations/enabled/`;
  return getAuthenticatedHttpClient().get(url).then(response => response.data.enabled).catch(() => false);
}
