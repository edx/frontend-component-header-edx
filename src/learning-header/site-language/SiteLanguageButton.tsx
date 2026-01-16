import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { sendTrackEvent } from '@edx/frontend-platform/analytics';
import { IconButton } from '@openedx/paragon';
import { Language } from '@openedx/paragon/icons';

import SiteLanguageModal from './SiteLanguageModal.tsx';
import { fetchToggleEnabled } from './data.ts';
import './index.scss';

const logButtonProperties = 'properties';

const SiteLanguageButton = () => {
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
          sendTrackEvent('edx.whole_course_translations.unified_translations_button.displayed', logButtonProperties);
        }
      });
    }
  }, [courseId]);

  const handleButtonClick = () => {
    sendTrackEvent('edx.whole_course_translations.unified_translations_button.displayed', logButtonProperties);
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
        alt="Change site language"
        onClick={handleButtonClick}
      />
      <SiteLanguageModal
        isOpen={isModalOpen}
        close={closeModal}
      />
    </div>
  );
};

export default SiteLanguageButton;
