import React from 'react';
import {
  screen, fireEvent, waitFor,
} from '@testing-library/react';
import { AppContext } from '@edx/frontend-platform/react';
import { logError } from '@edx/frontend-platform/logging';
import { SiteLanguageModal } from '.';
import { render, initializeMockApp } from '../../../../setupTest';

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

jest.mock('../LanguageSelector', () => ({
  /* eslint-disable react/prop-types */
  LanguageSelector: ({ languages, selectedLanguage, setSelectedLanguage }) => (
    <div data-testid="language-selector" data-language-count={languages.length}>
      <button
        type="button"
        onClick={() => setSelectedLanguage('es')}
        data-testid="select-spanish"
      >
        Select Spanish
      </button>
      <div data-testid="selected-language">{selectedLanguage}</div>
    </div>
  ),
  /* eslint-enable react/prop-types */
}));

const mockFetchReleasedLanguages = jest.fn();
const mockSetSiteLanguage = jest.fn();
jest.mock('../../data', () => ({
  fetchReleasedLanguages: () => mockFetchReleasedLanguages(),
  setSiteLanguage: (...args) => mockSetSiteLanguage(...args),
}));

const releasedLanguages = [
  { code: 'en', name: 'English', released: true },
  { code: 'es', name: 'Español', released: true },
];

describe('SiteLanguageModal', () => {
  const mockClose = jest.fn();
  const authenticatedUser = {
    userId: 'abc123',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    roles: [],
    administrator: false,
  };

  beforeEach(() => {
    initializeMockApp();
    mockFetchReleasedLanguages.mockResolvedValue(releasedLanguages);
    mockSetSiteLanguage.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the released languages when opened and passes them to the selector', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );
    expect(screen.getByTestId('site-language-loading')).toBeInTheDocument();
    expect(screen.queryByTestId('language-selector')).not.toBeInTheDocument();

    const selector = await screen.findByTestId('language-selector');
    expect(selector).toHaveAttribute('data-language-count', String(releasedLanguages.length));
    expect(mockFetchReleasedLanguages).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('site-language-loading')).not.toBeInTheDocument();
  });

  it('shows an error and logs when the released languages cannot be loaded', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    const error = new Error('Network error');
    mockFetchReleasedLanguages.mockRejectedValue(error);

    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );

    expect(await screen.findByText('An error occurred while loading the available languages', { exact: false })).toBeInTheDocument();
    expect(logError).toHaveBeenCalledWith(
      'Failed to fetch released site languages',
      expect.objectContaining({ error }),
    );
    expect(screen.queryByTestId('language-selector')).not.toBeInTheDocument();
    expect(screen.queryByTestId('site-language-loading')).not.toBeInTheDocument();
  });

  it('falls back to the first available language when the site language is no longer released', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    // The site language ("en" under the test app) has been retired from DarkLangConfig.
    mockFetchReleasedLanguages.mockResolvedValue([
      { code: 'fr', name: 'Français', released: true },
      { code: 'de-de', name: 'Deutsch (Deutschland)', released: true },
    ]);

    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );

    await screen.findByTestId('language-selector');
    expect(screen.getByTestId('selected-language')).toHaveTextContent('fr');
  });

  it('keeps the site language selected when it is still released', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );

    await screen.findByTestId('language-selector');
    expect(screen.getByTestId('selected-language')).toHaveTextContent('en');
  });

  it('shows an empty state and disables submit when no languages are released', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    mockFetchReleasedLanguages.mockResolvedValue([]);

    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );

    expect(await screen.findByTestId('site-language-empty')).toBeInTheDocument();
    expect(screen.queryByTestId('language-selector')).not.toBeInTheDocument();
    expect(screen.getByText('Submit').closest('button')).toBeDisabled();
  });

  it('disables submit until the languages have loaded', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );

    expect(screen.getByText('Submit').closest('button')).toBeDisabled();
    await screen.findByTestId('language-selector');
    expect(screen.getByText('Submit').closest('button')).not.toBeDisabled();
  });

  it('does not fetch or render when closed', () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen={false} close={mockClose} />
      </AppContext.Provider>,
    );
    expect(screen.queryByTestId('language-selector')).not.toBeInTheDocument();
    expect(mockFetchReleasedLanguages).not.toHaveBeenCalled();
  });

  it('closes modal without saving when cancel is clicked', () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockClose).toHaveBeenCalled();
    expect(mockSetSiteLanguage).not.toHaveBeenCalled();
  });

  it('closes modal without saving if selected language matches current language', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );
    // Submit is disabled until the languages have loaded.
    await screen.findByTestId('language-selector');
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockClose).toHaveBeenCalled();
    });
    expect(mockSetSiteLanguage).not.toHaveBeenCalled();
  });

  it('saves language and reloads page on submit', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    delete window.location;
    window.location = { reload: jest.fn() } as any;

    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );

    // Change language
    const selectSpanishButton = await screen.findByTestId('select-spanish');
    fireEvent.click(selectSpanishButton);

    // Submit
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetSiteLanguage).toHaveBeenCalledWith('es', 'testuser', releasedLanguages);
    });
    await waitFor(() => {
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('shows error message when save fails', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    const error = new Error('Network error');
    mockSetSiteLanguage.mockRejectedValue(error);

    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );

    // Change language
    const selectSpanishButton = await screen.findByTestId('select-spanish');
    fireEvent.click(selectSpanishButton);

    // Submit
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetSiteLanguage).toHaveBeenCalledWith('es', 'testuser', releasedLanguages);
    });
    await waitFor(() => {
      expect(logError).toHaveBeenCalledWith(
        'Failed to set site language',
        expect.objectContaining({ error }),
      );
    });
    expect(screen.getByText('An error occurred when attempting to save your preferred language', { exact: false })).toBeInTheDocument();
    expect(mockClose).not.toHaveBeenCalled();
  });

  it('resets selected language when modal is closed', async () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    const { rerender } = render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );

    // Change language
    const selectSpanishButton = await screen.findByTestId('select-spanish');
    fireEvent.click(selectSpanishButton);
    expect(screen.getByTestId('selected-language')).toHaveTextContent('es');

    // Close modal
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Reopen modal
    rerender(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );

    // Should reset to original language
    expect(screen.getByTestId('selected-language')).toHaveTextContent('en');
  });
});
