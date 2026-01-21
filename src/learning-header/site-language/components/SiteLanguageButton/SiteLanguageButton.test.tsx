import React from 'react';
import {
  screen, fireEvent, waitFor,
} from '@testing-library/react';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { SiteLanguageButton } from '.';
import { initializeMockApp, render } from '../../../../setupTest';

const courseId = 'course-v1:edX+Demo+2024';
jest.mock('react-redux', () => ({
  useSelector: (_selector) => courseId,
}));

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

jest.mock('../SiteLanguageModal', () => ({
  // eslint-disable-next-line react/prop-types
  SiteLanguageModal: ({ isOpen }) => (isOpen ? <div data-testid="site-language-modal">Modal Open</div> : null),
}));

const mockFetchToggleEnabled = jest.fn();
jest.mock('../../data', () => ({
  fetchToggleEnabled: (courseKey) => mockFetchToggleEnabled(courseKey),
}));

describe('SiteLanguageButton', () => {
  beforeEach(async () => {
    await initializeMockApp();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('does not render if feature is not enabled', async () => {
    mockFetchToggleEnabled.mockResolvedValue(false);
    render(<SiteLanguageButton />);
    await waitFor(() => {
      expect(mockFetchToggleEnabled).toHaveBeenCalledWith(courseId);
    });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders and tracks display if feature is enabled', async () => {
    mockFetchToggleEnabled.mockResolvedValue(true);
    render(<SiteLanguageButton />);
    await waitFor(() => {
      expect(mockFetchToggleEnabled).toHaveBeenCalledWith(courseId);
    });
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    expect(sendTrackEvent).toHaveBeenCalledWith(
      'edx.whole_course_translations.unified_translations_button.displayed',
      { courserun_key: 'course-v1:edX+Demo+2024' },
    );
  });

  it('opens modal and tracks click when button is clicked', async () => {
    mockFetchToggleEnabled.mockResolvedValue(true);
    render(<SiteLanguageButton />);
    // Wait for useEffect
    await waitFor(() => {
      expect(mockFetchToggleEnabled).toHaveBeenCalledWith(courseId);
    });
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(sendTrackEvent).toHaveBeenCalledWith(
      'edx.whole_course_translations.unified_translations_button.clicked',
      { courserun_key: 'course-v1:edX+Demo+2024' },
    );
    expect(screen.getByTestId('site-language-modal')).toBeInTheDocument();
  });
});
