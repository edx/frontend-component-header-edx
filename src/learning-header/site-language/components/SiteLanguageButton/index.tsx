import React, {
  useCallback, useEffect, useState,
} from 'react';

import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { IconButton } from '@openedx/paragon';
import { Language } from '@openedx/paragon/icons';

import { SiteLanguageModal } from '../SiteLanguageModal';
import messages from '../../messages';
import './index.scss';

interface SiteLanguageButtonProps {
  trackingProps: Record<string, string>;
}

/**
 * SiteLanguageButton component for displaying the site language selection button and modal.
 *
 * @returns {JSX.Element} The rendered SiteLanguageButton component.
 */
export const SiteLanguageButton = ({ trackingProps }: SiteLanguageButtonProps) => {
  const { formatMessage } = useIntl();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    sendTrackEvent('edx.whole_course_translations.unified_translations_button.displayed', trackingProps);
  }, [trackingProps]);

  const handleButtonClick = useCallback(() => {
    sendTrackEvent('edx.whole_course_translations.unified_translations_button.clicked', trackingProps);
    setIsModalOpen(true);
  }, [trackingProps]);

  return (
    <div className="site-language-selector-header-icon">
      <IconButton
        className="site-language-selection-button"
        src={Language}
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
