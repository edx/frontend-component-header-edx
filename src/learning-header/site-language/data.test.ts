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
