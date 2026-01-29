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
  // eslint-disable-next-line react/prop-types
  LanguageSelector: ({ selectedLanguage, setSelectedLanguage }) => (
    <div data-testid="language-selector">
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
}));

const mockGetSiteLanguage = jest.fn();
const mockSetSiteLanguage = jest.fn();
jest.mock('../../data', () => ({
  getSiteLanguage: () => mockGetSiteLanguage(),
  setSiteLanguage: (languageCode, username) => mockSetSiteLanguage(languageCode, username),
}));

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
    mockGetSiteLanguage.mockReturnValue('en');
    mockSetSiteLanguage.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when open', () => {
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    render(
      <AppContext.Provider value={contextValue}>
        <SiteLanguageModal isOpen close={mockClose} />
      </AppContext.Provider>,
    );
    expect(screen.getByTestId('language-selector')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
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
    const selectSpanishButton = screen.getByTestId('select-spanish');
    fireEvent.click(selectSpanishButton);

    // Submit
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetSiteLanguage).toHaveBeenCalledWith('es', 'testuser');
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
    const selectSpanishButton = screen.getByTestId('select-spanish');
    fireEvent.click(selectSpanishButton);

    // Submit
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetSiteLanguage).toHaveBeenCalledWith('es', 'testuser');
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

  it('resets selected language when modal is closed', () => {
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
    const selectSpanishButton = screen.getByTestId('select-spanish');
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
