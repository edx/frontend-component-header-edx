import React, {
  useCallback, useEffect, useState,
} from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { IconButton, ProductTour } from '@openedx/paragon';
import { Language } from '@openedx/paragon/icons';

import useSiteLanguageTour from '../ProductTour/useSiteLanguageTour';
import { SiteLanguageModal } from '../SiteLanguageModal';
import messages from '../../messages';

interface SiteLanguageButtonProps {
  courseId: string | null;
  userId: string;
}

/**
 * SiteLanguageButton component for displaying the site language selection button and modal.
 *
 * @returns {JSX.Element} The rendered SiteLanguageButton component.
 */
export const SiteLanguageButton = ({ courseId, userId }: SiteLanguageButtonProps) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { siteLanguageTour } = useSiteLanguageTour();
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (courseId && userId) {
      sendTrackEvent('edx.whole_course_translations.unified_translations_button.displayed', { courseId, userId });
    }
  }, [courseId, userId]);

  const handleButtonClick = useCallback(() => {
    sendTrackEvent('edx.whole_course_translations.unified_translations_button.clicked', { courseId, userId });
    setIsModalOpen(true);
  }, [courseId, userId]);

  return (
    <div
      id="site-language-selector-header-icon"
      className="user-header-secondary-item"
    >
      <ProductTour
        tours={[siteLanguageTour]}
      />
      <IconButton
        id="site-language-selection-button"
        src={Language}
        size="inline"
        variant="light"
        iconClassNames="text-primary-500"
        alt={formatMessage(messages.buttonScreenReaderLabel)}
        onClick={handleButtonClick}
      />
      <SiteLanguageModal
        isOpen={isModalOpen}
        close={closeModal}
      />
    </div>
  );
};
