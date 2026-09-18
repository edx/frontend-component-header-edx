// Tests for site language data functions
import { logError } from '@edx/frontend-platform/logging';
import { fetchReleasedLanguages, setSiteLanguage, fetchUnifiedTranslationToggleEnabled } from './data';

const mockGetMethod = jest.fn();
const mockPostMethod = jest.fn();
const mockPatchMethod = jest.fn();
// The public released-languages read goes through the unauthenticated client, while the
// writes that touch the user's own preferences go through the authenticated one.
const mockAuthenticatedGet = jest.fn();
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: () => ({
    get: mockAuthenticatedGet,
    post: mockPostMethod,
    patch: mockPatchMethod,
  }),
  getHttpClient: () => ({
    get: mockGetMethod,
  }),
}));
jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    LMS_BASE_URL: 'http://test',
  })),
}));
jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
});

const releasedLanguages = [
  { code: 'en', name: 'English', released: true },
  { code: 'fr', name: 'Français', released: true },
  { code: 'es-419', name: 'Español (Latinoamérica)', released: true },
  { code: 'de-de', name: 'Deutsch (Deutschland)', released: true },
];

describe('site-language/data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = '';
  });

  describe('fetchReleasedLanguages', () => {
    it('fetches the released languages from the LMS', async () => {
      mockGetMethod.mockResolvedValueOnce({ data: releasedLanguages });
      await expect(fetchReleasedLanguages()).resolves.toEqual(releasedLanguages);
      expect(mockGetMethod).toHaveBeenCalledWith('http://test/api/lang_pref/v1/released_languages');
    });

    it('reads the public endpoint without sending the user credentials', async () => {
      mockGetMethod.mockResolvedValueOnce({ data: releasedLanguages });
      await fetchReleasedLanguages();
      expect(mockAuthenticatedGet).not.toHaveBeenCalled();
    });

    it('drops beta languages (released: false)', async () => {
      mockGetMethod.mockResolvedValueOnce({
        data: [
          ...releasedLanguages,
          { code: 'lt-lt', name: 'Lietuvių (Lietuva)', released: false },
        ],
      });
      await expect(fetchReleasedLanguages()).resolves.toEqual(releasedLanguages);
    });

    it('rejects when the request fails', async () => {
      const error = new Error('fail');
      mockGetMethod.mockRejectedValueOnce(error);
      await expect(fetchReleasedLanguages()).rejects.toBe(error);
    });
  });

  describe('setSiteLanguage', () => {
    it('calls patchPreferences and postSetLang sequentially (patch first)', async () => {
      const callOrder: string[] = [];

      mockPatchMethod.mockImplementationOnce(() => {
        callOrder.push('patch');
        return Promise.resolve({});
      });
      mockPostMethod.mockImplementationOnce(() => {
        callOrder.push('post');
        return Promise.resolve({});
      });
      await setSiteLanguage('fr', 'testuser', releasedLanguages);
      expect(mockPatchMethod).toHaveBeenCalledWith(
        'http://test/api/user/v1/preferences/testuser',
        { 'pref-lang': 'fr' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      );
      expect(mockPostMethod).toHaveBeenCalledWith(
        'http://test/i18n/setlang/',
        expect.any(FormData),
        expect.objectContaining({ headers: expect.any(Object) }),
      );
      expect(mockPostMethod.mock.calls[0][1].get('language')).toBe('fr');
      expect(callOrder).toEqual(['patch', 'post']);
    });

    it('encodes special characters in username', async () => {
      mockPatchMethod.mockResolvedValueOnce({});
      mockPostMethod.mockResolvedValueOnce({});
      await setSiteLanguage('es-419', 'test+user@example.com', releasedLanguages);
      expect(mockPatchMethod).toHaveBeenCalledWith(
        'http://test/api/user/v1/preferences/test%2Buser%40example.com',
        { 'pref-lang': 'es-419' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      );
    });

    it('encodes spaces in username', async () => {
      mockPatchMethod.mockResolvedValueOnce({});
      mockPostMethod.mockResolvedValueOnce({});
      await setSiteLanguage('de-de', 'test user', releasedLanguages);
      expect(mockPatchMethod).toHaveBeenCalledWith(
        'http://test/api/user/v1/preferences/test%20user',
        { 'pref-lang': 'de-de' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      );
    });

    it('throws error for invalid language code', async () => {
      await expect(setSiteLanguage('invalid-lang', 'testuser', releasedLanguages))
        .rejects
        .toThrow('Invalid language code: invalid-lang. Must be one of the supported languages.');
      expect(mockPatchMethod).not.toHaveBeenCalled();
      expect(mockPostMethod).not.toHaveBeenCalled();
    });

    it('throws error for empty language code', async () => {
      await expect(setSiteLanguage('', 'testuser', releasedLanguages))
        .rejects
        .toThrow('Invalid language code: . Must be one of the supported languages.');
      expect(mockPatchMethod).not.toHaveBeenCalled();
      expect(mockPostMethod).not.toHaveBeenCalled();
    });

    it('accepts every code in the released languages list', async () => {
      mockPatchMethod.mockResolvedValue({});
      mockPostMethod.mockResolvedValue({});

      const validLanguageCodes = releasedLanguages.map(language => language.code);

      for (const langCode of validLanguageCodes) {
        // eslint-disable-next-line no-await-in-loop
        await expect(setSiteLanguage(langCode, 'testuser', releasedLanguages)).resolves.not.toThrow();
      }

      expect(mockPatchMethod).toHaveBeenCalledTimes(validLanguageCodes.length);
      expect(mockPostMethod).toHaveBeenCalledTimes(validLanguageCodes.length);
    });

    it('rejects a code that is not in the released languages list, even if it used to be hardcoded', async () => {
      await expect(setSiteLanguage('th', 'testuser', releasedLanguages))
        .rejects
        .toThrow('Invalid language code: th. Must be one of the supported languages.');
      expect(mockPatchMethod).not.toHaveBeenCalled();
    });
  });

  describe('fetchUnifiedTranslationToggleEnabled', () => {
    it('returns true if enabled', async () => {
      mockAuthenticatedGet.mockResolvedValueOnce({ data: { enabled: true } });
      await expect(fetchUnifiedTranslationToggleEnabled()).resolves.toBe(true);
    });

    it('returns false if not enabled', async () => {
      mockAuthenticatedGet.mockResolvedValueOnce({ data: { enabled: false } });
      await expect(fetchUnifiedTranslationToggleEnabled()).resolves.toBe(false);
    });

    it('returns false and logs error on failure', async () => {
      const error = new Error('fail');
      mockAuthenticatedGet.mockRejectedValueOnce(error);
      await expect(fetchUnifiedTranslationToggleEnabled()).resolves.toBe(false);
      expect(logError).toHaveBeenCalledWith(
        'Failed to fetch unified translations toggle state',
        expect.objectContaining({ error }),
      );
    });
  });
});
