/**
 * NOTE: This is a hardcoded list of the languages we are currently supporting for this
 *       language selector component. It is copied from the languages that are currently widely
 *       supported by the xpert translation feature. This list is not intended to be a permanent
 *       solution and should be replaced with a dynamic
 *       list of languages from a backend API in later iterations.
 *
 * TODO: Replace this hardcoded list with a dynamic list from a config endpoint
 */

export const TRANSLATION_LANGUAGES = [
  {
    code: 'en',
    label: 'English',
    localeName: 'English (US)',
  },
  {
    code: 'es-419',
    label: 'Spanish (Latin America)',
    localeName: 'Español (Latinoamérica)',
  },
  {
    code: 'fr',
    label: 'French',
    localeName: 'Français',
  },
  {
    code: 'pt-br',
    label: 'Portuguese (Brazil)',
    localeName: 'Português (Brasil)',
  },
  {
    code: 'zh-cn',
    label: 'Chinese (Simplified)',
    localeName: '中文 (简体)',
  },
  {
    code: 'ar',
    label: 'Arabic',
    localeName: 'العربية',
  },
  {
    code: 'es-es',
    label: 'Spanish (Spain)',
    localeName: 'Español (España)',
  },
  {
    code: 'tr-tr',
    label: 'Turkish (Turkey)',
    localeName: 'Türkçe (Türkiye)',
  },
  {
    code: 'de-de',
    label: 'German (Germany)',
    localeName: 'Deutsch (Deutschland)',
  },
  {
    code: 'it-it',
    label: 'Italian (Italy)',
    localeName: 'Italiano (Italia)',
  },
  {
    code: 'id',
    label: 'Indonesian',
    localeName: 'Bahasa Indonesia',
  },
  {
    code: 'ko-kr',
    label: 'Korean',
    localeName: '한국어',
  },
  {
    code: 'el',
    label: 'Greek',
    localeName: 'Ελληνικά',
  },
  {
    code: 'th',
    label: 'Thai',
    localeName: 'ไทย',
  },
];
