// Helper functions to handle loading and setting the site language setting

import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';
import { TRANSLATION_LANGUAGES } from './components/LanguageSelector/languagesList';

/**
 * Validate that the language code is supported.
 *
 * @param languageCode - The language code to validate.
 * @returns True if the language code is valid, false otherwise.
 */
function isValidLanguageCode(languageCode: string): boolean {
  return TRANSLATION_LANGUAGES.some(lang => lang.code === languageCode);
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
  const encodedUsername = encodeURIComponent(username);
  const requestUrl = `${getConfig().LMS_BASE_URL}/api/user/v1/preferences/${encodedUsername}`;

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
 * @throws {Error} If the language code is not supported.
 */
export async function setSiteLanguage(languageCode: string, username: string): Promise<void> {
  // Validate the language code
  if (!isValidLanguageCode(languageCode)) {
    throw new Error(`Invalid language code: ${languageCode}. Must be one of the supported languages.`);
  }

  // Update the user's language preference by making API calls to the
  // user preferences API and the i18n API
  await Promise.all([
    patchPreferences(username, languageCode),
    postSetLang(languageCode),
  ]);
}

/**
 * Fetch the toggle state for unified translations for a course.
 *
 * @returns A promise that resolves to a boolean indicating whether the feature is enabled.
 */
export async function fetchUnifiedTranslationToggleEnabled(): Promise<boolean> {
  const url = `${getConfig().LMS_BASE_URL}/api/unified-translations/enabled/`;
  return getAuthenticatedHttpClient()
    .get(url)
    .then(response => response.data.enabled)
    .catch((error) => {
      logError('Failed to fetch unified translations toggle state', { error });
      return false;
    });
}
