import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { getLocale } from '@edx/frontend-platform/i18n';
import { TranslationDisclaimer } from './TranslationDisclaimer';
import messages from '../../messages';
import { render, initializeMockApp } from '../../../../setupTest';

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  getLocale: jest.fn(),
}));
const mockGetLocale = getLocale as jest.MockedFunction<typeof getLocale>;

describe('TranslationDisclaimer', () => {
  beforeEach(() => {
    mockGetLocale.mockReturnValue('en');
    initializeMockApp();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the disclaimer trigger text', () => {
    render(<TranslationDisclaimer />);
    expect(screen.getByText(messages.popoverDisclaimerTitle.defaultMessage)).toBeInTheDocument();
  });

  it('applies ltr direction for left-to-right languages', () => {
    const { container } = render(<TranslationDisclaimer />);
    const dirDiv = container.querySelector('div[dir]');
    expect(dirDiv).toHaveAttribute('dir', 'ltr');
  });

  it('applies rtl direction for right-to-left languages', () => {
    mockGetLocale.mockReturnValue('ar');
    const { container } = render(<TranslationDisclaimer />);
    const dirDiv = container.querySelector('div[dir]');
    expect(dirDiv).toHaveAttribute('dir', 'rtl');
  });

  it('shows popover content when clicked', async () => {
    render(<TranslationDisclaimer />);
    const trigger = screen.getByText(messages.popoverDisclaimerTitle.defaultMessage);
    fireEvent.click(trigger);
    await waitFor(() => {
      expect(screen.getByText(messages.popoverDisclaimerContent.defaultMessage)).toBeInTheDocument();
      expect(screen.getByText(messages.popoverDisclaimerWarranties.defaultMessage)).toBeInTheDocument();
    });
  });
});
