import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  modalTitle: {
    id: 'header.sitelanguage.modal.title',
    defaultMessage: 'Translate Course',
    description: 'The title for the translation modal.',
  },
  popoverDisclaimerTitle: {
    id: 'header.sitelanguage.modal.popover.disclaimer.title',
    defaultMessage: 'Disclaimers',
    description: 'Disclaimer Popover Title',
  },
  popoverDisclaimerContent: {
    id: 'header.sitelanguage.modal.popover.disclaimer.content',
    defaultMessage: 'Eligible content includes most video transcripts, quizzes, and on platform text.',
    description: 'Line explaining the content to be translated in popover.',
  },
  popoverDisclaimerWarranties: {
    id: 'header.sitelanguage.modal.popover.disclaimer.warranties',
    defaultMessage: 'This service may contain translations provided by third parties, including artificial intelligence software/services. edX, its affiliates and licensors and the translation provider (the “Entities”) disclaim all warranties related to the translations. The translations are provided "as is" and the Entities disclaim all warranties whether express, implied, statutory or otherwise, including but not limited to any warranties of accuracy, reliability, merchantability, fitness for a particular purpose, satisfactory quality and non-infringement.',
    description: 'Line explaining the warranties in popover.',
  },
  cancelButtonText: {
    id: 'header.sitelanguage.modal.button.cancel.label',
    defaultMessage: 'Cancel',
    description: 'Cancel button text for the site language modal.',
  },
  submitButtonText: {
    id: 'header.sitelanguage.modal.button.submit.label',
    defaultMessage: 'Submit',
    description: 'Submit button text for the site language modal.',
  },
  saveErrorMessage: {
    id: 'header.sitelanguage.modal.save.error.message',
    defaultMessage: 'An error occurred when attempting to save your preferred language. Please try again later.',
    description: 'The error message displayed in the site language modal when saving the preferred language fails.',
  },
});

export default messages;
