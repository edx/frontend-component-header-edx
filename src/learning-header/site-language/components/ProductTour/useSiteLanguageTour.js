import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useSelector } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './messages';

const hasSeenSiteLanguageTourKey = 'hasSeenSiteLanguageTour';

const useSiteLanguageTour = () => {
  const { formatMessage } = useIntl();
  const {
    showExistingUserCourseHomeTour = false,
    showNewUserCourseHomeModal = false,
    showNewUserCourseHomeTour = false,
    toursEnabled = false,
  } = useSelector(state => state.tours) || {};

  const [isTourEnabled, setIsTourEnabled] = useState(false);

  const closeTour = useCallback(() => {
    global.localStorage.setItem(hasSeenSiteLanguageTourKey, 'true');
    setIsTourEnabled(false);
  }, []);

  const siteLanguageTour = useMemo(() => ({
    tourId: 'site-language-button',
    enabled: isTourEnabled,
    checkpoints: [
      {
        title: formatMessage(messages.siteLanguageProductTourModalTitle),
        body: formatMessage(messages.siteLanguageProductTourModalBody),
        placement: 'bottom',
        target: '#site-language-selection-button',
        endButtonText: formatMessage(messages.siteLanguageProductTourDismissButtonText),
        onEnd: closeTour,
      },
    ],
  }), [isTourEnabled, closeTour, formatMessage]);

  useEffect(() => {
    const shouldEnableTour = toursEnabled
      && !showExistingUserCourseHomeTour
      && !showNewUserCourseHomeModal
      && !showNewUserCourseHomeTour
      && global.localStorage.getItem(hasSeenSiteLanguageTourKey) !== 'true';
    setIsTourEnabled(shouldEnableTour);
  }, [toursEnabled, showExistingUserCourseHomeTour, showNewUserCourseHomeModal, showNewUserCourseHomeTour]);

  return {
    siteLanguageTour,
  };
};

export default useSiteLanguageTour;
