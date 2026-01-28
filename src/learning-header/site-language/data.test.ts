// Tests for site language data functions
import { logError } from '@edx/frontend-platform/logging';
import { setSiteLanguage, fetchUnifiedTranslationToggleEnabled } from './data';

const mockGetMethod = jest.fn();
const mockPostMethod = jest.fn();
const mockPatchMethod = jest.fn();
jest.mock('@edx/frontend-platform/auth', () => ({
  getAuthenticatedHttpClient: () => ({
    get: mockGetMethod,
    post: mockPostMethod,
    patch: mockPatchMethod,
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

describe('site-language/data', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.cookie = '';
  });

  describe('setSiteLanguage', () => {
    it('calls patchPreferences and postSetLang', async () => {
      mockPatchMethod.mockResolvedValueOnce({});
      mockPostMethod.mockResolvedValueOnce({});
      await setSiteLanguage('fr', 'testuser');
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
    });

    it('encodes special characters in username', async () => {
      mockPatchMethod.mockResolvedValueOnce({});
      mockPostMethod.mockResolvedValueOnce({});
      await setSiteLanguage('es-419', 'test+user@example.com');
      expect(mockPatchMethod).toHaveBeenCalledWith(
        'http://test/api/user/v1/preferences/test%2Buser%40example.com',
        { 'pref-lang': 'es-419' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      );
    });

    it('encodes spaces in username', async () => {
      mockPatchMethod.mockResolvedValueOnce({});
      mockPostMethod.mockResolvedValueOnce({});
      await setSiteLanguage('de-de', 'test user');
      expect(mockPatchMethod).toHaveBeenCalledWith(
        'http://test/api/user/v1/preferences/test%20user',
        { 'pref-lang': 'de-de' },
        { headers: { 'Content-Type': 'application/merge-patch+json' } },
      );
    });

    it('throws error for invalid language code', async () => {
      await expect(setSiteLanguage('invalid-lang', 'testuser'))
        .rejects
        .toThrow('Invalid language code: invalid-lang. Must be one of the supported languages.');
      expect(mockPatchMethod).not.toHaveBeenCalled();
      expect(mockPostMethod).not.toHaveBeenCalled();
    });

    it('throws error for empty language code', async () => {
      await expect(setSiteLanguage('', 'testuser'))
        .rejects
        .toThrow('Invalid language code: . Must be one of the supported languages.');
      expect(mockPatchMethod).not.toHaveBeenCalled();
      expect(mockPostMethod).not.toHaveBeenCalled();
    });

    it('accepts valid language codes', async () => {
      mockPatchMethod.mockResolvedValue({});
      mockPostMethod.mockResolvedValue({});

      const validLanguageCodes = ['en', 'es-419', 'fr', 'pt-br', 'zh-cn', 'ar', 'es-es', 'tr-tr', 'de-de', 'it-it', 'id', 'ko-kr', 'el', 'th'];

      for (const langCode of validLanguageCodes) {
        // eslint-disable-next-line no-await-in-loop
        await expect(setSiteLanguage(langCode, 'testuser')).resolves.not.toThrow();
      }

      expect(mockPatchMethod).toHaveBeenCalledTimes(validLanguageCodes.length);
      expect(mockPostMethod).toHaveBeenCalledTimes(validLanguageCodes.length);
    });
  });

  describe('fetchUnifiedTranslationToggleEnabled', () => {
    it('returns true if enabled', async () => {
      mockGetMethod.mockResolvedValueOnce({ data: { enabled: true } });
      await expect(fetchUnifiedTranslationToggleEnabled()).resolves.toBe(true);
    });

    it('returns false if not enabled', async () => {
      mockGetMethod.mockResolvedValueOnce({ data: { enabled: false } });
      await expect(fetchUnifiedTranslationToggleEnabled()).resolves.toBe(false);
    });

    it('returns false and logs error on failure', async () => {
      const error = new Error('fail');
      mockGetMethod.mockRejectedValueOnce(error);
      await expect(fetchUnifiedTranslationToggleEnabled()).resolves.toBe(false);
      expect(logError).toHaveBeenCalledWith(
        'Failed to fetch unified translations toggle state',
        expect.objectContaining({ error }),
      );
    });
  });
});
