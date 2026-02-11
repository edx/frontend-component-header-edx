import { renderHook, act } from '@testing-library/react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useSelector } from 'react-redux';
import useSiteLanguageTour from './useSiteLanguageTour';
import { initializeMockApp } from '../../../../setupTest';

jest.mock('@edx/frontend-platform/i18n', () => ({
  ...jest.requireActual('@edx/frontend-platform/i18n'),
  useIntl: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

describe('useSiteLanguageTour', () => {
  const mockFormatMessage = jest.fn((msg) => msg.defaultMessage);
  const mockToursState = {
    showExistingUserCourseHomeTour: false,
    showNewUserCourseHomeModal: false,
    showNewUserCourseHomeTour: false,
    toursEnabled: true,
  };

  beforeEach(() => {
    initializeMockApp();
    useIntl.mockReturnValue({
      formatMessage: mockFormatMessage,
    });
    useSelector.mockReturnValue({
      ...mockToursState,
    });
    global.localStorage.clear();
  });

  afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
  });

  it('enables tour when not seen before, base tours are not showing, and base tours are loaded', () => {
    const { result } = renderHook(() => useSiteLanguageTour());
    expect(result.current.siteLanguageTour.enabled).toBe(true);
  });

  it('does not show tour until base tours are successfully loaded', () => {
    useSelector.mockReturnValue({
      ...mockToursState,
      toursEnabled: false,
    });
    const { result, rerender } = renderHook(() => useSiteLanguageTour());
    expect(result.current.siteLanguageTour.enabled).toBe(false);

    // Simulate tours being loaded
    useSelector.mockReturnValue({
      ...mockToursState,
      toursEnabled: true,
    });
    rerender();
    expect(result.current.siteLanguageTour.enabled).toBe(true);
  });

  it('disables tour when already seen', () => {
    global.localStorage.setItem('hasSeenSiteLanguageTour', 'true');
    const { result } = renderHook(() => useSiteLanguageTour());
    expect(result.current.siteLanguageTour.enabled).toBe(false);
  });

  describe('disables tour when base tours are showing ', () => {
    it('existing user course home tour', () => {
      useSelector.mockReturnValue({
        ...mockToursState,
        showExistingUserCourseHomeTour: true,
      });
      const { result } = renderHook(() => useSiteLanguageTour());
      expect(result.current.siteLanguageTour.enabled).toBe(false);
    });

    it('new user course home modal', () => {
      useSelector.mockReturnValue({
        ...mockToursState,
        showNewUserCourseHomeModal: true,
      });
      const { result } = renderHook(() => useSiteLanguageTour());
      expect(result.current.siteLanguageTour.enabled).toBe(false);
    });

    it('new user course home tour', () => {
      useSelector.mockReturnValue({
        ...mockToursState,
        showNewUserCourseHomeTour: true,
      });
      const { result } = renderHook(() => useSiteLanguageTour());
      expect(result.current.siteLanguageTour.enabled).toBe(false);
    });
  });

  it('closeTour sets localStorage and disables tour', () => {
    const { result } = renderHook(() => useSiteLanguageTour());
    expect(result.current.siteLanguageTour.enabled).toBe(true);
    // Call the onEnd callback (which is closeTour)
    act(() => {
      result.current.siteLanguageTour.checkpoints[0].onEnd();
    });
    expect(global.localStorage.getItem('hasSeenSiteLanguageTour')).toBe('true');
    expect(result.current.siteLanguageTour.enabled).toBe(false);
  });

  it('does not re-enable tour after being closed', () => {
    const { result, rerender } = renderHook(() => useSiteLanguageTour());
    expect(result.current.siteLanguageTour.enabled).toBe(true);
    // Close the tour
    act(() => {
      result.current.siteLanguageTour.checkpoints[0].onEnd();
    });
    expect(result.current.siteLanguageTour.enabled).toBe(false);

    // Try to trigger a re-render by changing tour state
    useSelector.mockReturnValue({
      ...mockToursState,
      showExistingUserCourseHomeTour: true,
    });
    rerender();
    useSelector.mockReturnValue({
      ...mockToursState,
      showExistingUserCourseHomeTour: false,
    });
    rerender();

    // Should still be disabled because localStorage is set
    expect(result.current.siteLanguageTour.enabled).toBe(false);
  });
});
