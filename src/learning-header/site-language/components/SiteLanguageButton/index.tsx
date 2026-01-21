import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useIntl } from '@edx/frontend-platform/i18n';
import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { IconButton } from '@openedx/paragon';
import { Language } from '@openedx/paragon/icons';

import { SiteLanguageModal } from '../SiteLanguageModal';
import { fetchToggleEnabled } from '../../data';
import messages from '../../messages';
import './index.scss';

/**
 * SiteLanguageButton component for displaying the site language selection button and modal.
 *
 * @returns {JSX.Element} The rendered SiteLanguageButton component.
 */
export const SiteLanguageButton = () => {
  const { formatMessage } = useIntl();
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const courseId = useSelector(
    // @ts-ignore: No practical way to get the actual typing of the learning mfe redux state here
    state => state.courseware.courseId ?? state.courseHome.courseId,
  );

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (courseId) {
      fetchToggleEnabled(courseId).then((enabled) => {
        setIsFeatureEnabled(enabled);
        if (enabled) {
          sendTrackEvent('edx.whole_course_translations.unified_translations_button.displayed', { courserun_key: courseId });
        }
      });
    }
  }, [courseId]);

  const handleButtonClick = () => {
    sendTrackEvent('edx.whole_course_translations.unified_translations_button.clicked', { courserun_key: courseId });
    setIsModalOpen(true);
  };

  if (!isFeatureEnabled) {
    return null;
  }

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
