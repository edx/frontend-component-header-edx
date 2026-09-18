// Helper functions to handle loading and setting the site language setting

import { getAuthenticatedHttpClient, getHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';

/**
 * A site language as returned by the LMS released-languages endpoint.
 * `released` is false for beta languages (DarkLangConfig.beta_languages).
 */
export interface SiteLanguage {
  code: string;
  name: string;
  released: boolean;
}

/**
 * Fetch the site languages that have been released via DarkLangConfig on the LMS.
 *
 * Beta languages are dropped: the header has no way to label them as beta, and
 * they are not meant to be selectable here.
 *
 * The endpoint is public and returns the same list for every caller, so this uses the
 * unauthenticated client: sending a JWT would gain nothing and would couple a public
 * read to the user's auth state.
 *
 * @returns A promise that resolves to the released languages, in the order the LMS returns them.
 * @throws If the request fails, so the caller can render an error state.
 */
export async function fetchReleasedLanguages(): Promise<SiteLanguage[]> {
  const url = `${getConfig().LMS_BASE_URL}/api/lang_pref/v1/released_languages`;
  const { data } = await getHttpClient().get(url);
  return (data as SiteLanguage[]).filter(language => language.released);
}

/**
 * Validate that the language code is one of the given languages.
 *
 * @param languageCode - The language code to validate.
 * @param languages - The languages the user may choose from.
 * @returns True if the language code is valid, false otherwise.
 */
function isValidLanguageCode(languageCode: string, languages: SiteLanguage[]): boolean {
  return languages.some(lang => lang.code === languageCode);
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
 * @param languages - The released languages the code must belong to (see fetchReleasedLanguages).
 * @throws {Error} If the language code is not one of the released languages.
 */
export async function setSiteLanguage(
  languageCode: string,
  username: string,
  languages: SiteLanguage[],
): Promise<void> {
  // Validate the language code
  if (!isValidLanguageCode(languageCode, languages)) {
    throw new Error(`Invalid language code: ${languageCode}. Must be one of the supported languages.`);
  }

  // Update the user's language preference by making API calls to the
  // user preferences API and the i18n API
  await patchPreferences(username, languageCode);
  await postSetLang(languageCode);
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
