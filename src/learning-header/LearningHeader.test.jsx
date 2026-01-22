import React from 'react';
import { AppContext } from '@edx/frontend-platform/react';
import {
  fireEvent, initializeMockApp, render, screen, waitFor,
} from '../setupTest';
import { LearningHeader as Header } from '../index';

jest.mock('react-redux', () => ({
  useSelector: (_selector) => 'course-v1:org+course+run',
}));

jest.mock('./site-language/components/SiteLanguageButton', () => ({
  SiteLanguageButton: (_props) => (<div data-testid="site-language-button">Site Language Button</div>),
}));

const mockFetchUnifiedTranslationToggleEnabled = jest.fn();
jest.mock('./site-language/data', () => ({
  fetchUnifiedTranslationToggleEnabled: () => mockFetchUnifiedTranslationToggleEnabled(),
}));

describe('Header', () => {
  beforeAll(async () => {
    // We need to mock AuthService to implicitly use `getAuthenticatedUser` within `AppContext.Provider`.
    await initializeMockApp();
  });

  beforeEach(() => {
    mockFetchUnifiedTranslationToggleEnabled.mockResolvedValue(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('displays user button', () => {
    render(<Header />);
    expect(screen.getByTestId('user-dropdown-toggle')).toBeInTheDocument();
  });

  it('displays user menu in dropdown', () => {
    const authenticatedUser = {
      userId: 'abc123',
      username: 'edX',
      name: 'edX',
      email: 'test@example.com',
      roles: [],
      administrator: false,
    };
    const contextValue = {
      authenticatedUser,
      config: {},
    };
    const component = (
      <AppContext.Provider
        value={contextValue}
      >
        <Header />
      </AppContext.Provider>
    );

    render(component);

    const button = screen.getByTestId('user-dropdown-toggle');
    fireEvent.click(button);
    const userMenuItem = screen.queryByTestId('user-item');
    expect(userMenuItem).toBeInTheDocument();
  });

  it('displays course data', () => {
    const courseData = {
      courseOrg: 'course-org',
      courseNumber: 'course-number',
      courseTitle: 'course-title',
    };
    render(<Header {...courseData} />);

    expect(screen.getByText(`${courseData.courseOrg} ${courseData.courseNumber}`)).toBeInTheDocument();
    expect(screen.getByText(courseData.courseTitle)).toBeInTheDocument();
  });

  it('shows site language button when feature is enabled', async () => {
    mockFetchUnifiedTranslationToggleEnabled.mockResolvedValue(true);
    render(<Header />);

    await waitFor(() => {
      expect(mockFetchUnifiedTranslationToggleEnabled).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId('site-language-button')).toBeInTheDocument();
    });
  });

  it('does not show site language button when feature is disabled', async () => {
    mockFetchUnifiedTranslationToggleEnabled.mockResolvedValue(false);
    render(<Header />);

    await waitFor(() => {
      expect(mockFetchUnifiedTranslationToggleEnabled).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.queryByTestId('site-language-button')).not.toBeInTheDocument();
    });
  });
});
