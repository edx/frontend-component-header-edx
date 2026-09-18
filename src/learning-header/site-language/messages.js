import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  modalTitle: {
    id: 'header.sitelanguage.modal.title',
    defaultMessage: 'Site language',
    description: 'The title for the translation modal.',
  },
  buttonScreenReaderLabel: {
    id: 'header.sitelanguage.modal.button.aria.label',
    defaultMessage: 'Change site language',
    description: 'Button label for changing the site language.',
  },
  popoverDisclaimerTitle: {
    id: 'header.sitelanguage.modal.popover.disclaimer.title',
    defaultMessage: 'Disclaimers',
    description: 'Disclaimer Popover Title',
  },
  popoverDisclaimerContent: {
    id: 'header.sitelanguage.modal.popover.disclaimer.content',
    defaultMessage: 'Eligible content includes most video transcripts, quizzes, and on platform text. Translations are generated using AI tools and may contain inaccuracies or error.',
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
  loadingLanguagesText: {
    id: 'header.sitelanguage.modal.loading.languages',
    defaultMessage: 'Loading languages',
    description: 'Screen reader text shown while the list of available site languages is loading.',
  },
  loadLanguagesErrorMessage: {
    id: 'header.sitelanguage.modal.load.error.message',
    defaultMessage: 'An error occurred while loading the available languages. Please try again later.',
    description: 'The error message displayed in the site language modal when the list of available languages cannot be loaded.',
  },
  noLanguagesMessage: {
    id: 'header.sitelanguage.modal.no.languages.message',
    defaultMessage: 'There are no languages available to select at this time.',
    description: 'The message displayed in the site language modal when the site has no released languages to offer.',
  },
  saveErrorMessage: {
    id: 'header.sitelanguage.modal.save.error.message',
    defaultMessage: 'An error occurred when attempting to save your preferred language. Please try again later.',
    description: 'The error message displayed in the site language modal when saving the preferred language fails.',
  },
});

export default messages;
