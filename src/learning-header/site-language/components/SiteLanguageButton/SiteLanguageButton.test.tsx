import React from 'react';
import {
  screen, fireEvent, waitFor,
} from '@testing-library/react';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { SiteLanguageButton } from '.';
import { initializeMockApp, render } from '../../../../setupTest';

jest.mock('@edx/frontend-platform/analytics', () => ({
  sendTrackEvent: jest.fn(),
}));

jest.mock('../SiteLanguageModal', () => ({
  // eslint-disable-next-line react/prop-types
  SiteLanguageModal: ({ isOpen }) => (isOpen ? <div data-testid="site-language-modal">Modal Open</div> : null),
}));

describe('SiteLanguageButton', () => {
  const props = {
    courseId: 'course-v1:edX+Demo+2024',
    userId: 'user-123',
  };

  beforeEach(async () => {
    await initializeMockApp();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders and tracks display', async () => {
    render(<SiteLanguageButton {...props} />);
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    expect(sendTrackEvent).toHaveBeenCalledWith(
      'edx.whole_course_translations.unified_translations_button.displayed',
      { courseId: props.courseId, userId: props.userId },
    );
  });

  it('opens modal and tracks click when button is clicked', async () => {
    render(<SiteLanguageButton {...props} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(sendTrackEvent).toHaveBeenCalledWith(
      'edx.whole_course_translations.unified_translations_button.clicked',
      { courseId: props.courseId, userId: props.userId },
    );
    expect(screen.getByTestId('site-language-modal')).toBeInTheDocument();
  });
});
