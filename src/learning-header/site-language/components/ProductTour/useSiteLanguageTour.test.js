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

  beforeEach(() => {
    initializeMockApp();
    useIntl.mockReturnValue({
      formatMessage: mockFormatMessage,
    });
    useSelector.mockReturnValue({
      showCoursewareTour: false,
    });
    global.localStorage.clear();
  });

  afterEach(() => {
    global.localStorage.clear();
    jest.clearAllMocks();
  });

  it('enables tour when not seen before and courseware tour is not showing', () => {
    useSelector.mockReturnValue({
      showCoursewareTour: false,
    });
    const { result } = renderHook(() => useSiteLanguageTour());
    expect(result.current.siteLanguageTour.enabled).toBe(true);
  });

  it('disables tour when already seen', () => {
    global.localStorage.setItem('hasSeenSiteLanguageTour', 'true');
    const { result } = renderHook(() => useSiteLanguageTour());
    expect(result.current.siteLanguageTour.enabled).toBe(false);
  });

  it('disables tour when courseware tour is showing', () => {
    useSelector.mockReturnValue({
      showCoursewareTour: true,
    });
    const { result } = renderHook(() => useSiteLanguageTour());
    expect(result.current.siteLanguageTour.enabled).toBe(false);
  });

  it('re-enables tour when courseware tour stops showing', () => {
    const { result, rerender } = renderHook(() => useSiteLanguageTour());

    // Initially, courseware tour is showing
    useSelector.mockReturnValue({
      showCoursewareTour: true,
    });
    rerender();
    expect(result.current.siteLanguageTour.enabled).toBe(false);

    // Courseware tour stops showing
    useSelector.mockReturnValue({
      showCoursewareTour: false,
    });
    rerender();
    expect(result.current.siteLanguageTour.enabled).toBe(true);
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

    // Try to trigger a re-render by changing courseware tour state
    useSelector.mockReturnValue({
      showCoursewareTour: true,
    });
    rerender();
    useSelector.mockReturnValue({
      showCoursewareTour: false,
    });
    rerender();

    // Should still be disabled because localStorage is set
    expect(result.current.siteLanguageTour.enabled).toBe(false);
  });
});
