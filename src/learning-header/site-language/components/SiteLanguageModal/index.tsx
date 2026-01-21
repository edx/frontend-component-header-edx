import { useState, useContext, useMemo } from 'react';

import './SiteLanguageModal.scss';
import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { logError } from '@edx/frontend-platform/logging';
import {
  ActionRow,
  Alert,
  Button,
  StatefulButton,
  StandardModal,
} from '@openedx/paragon';

import messages from '../../messages';
import { LanguageSelector } from '../LanguageSelector';
import { getSiteLanguage, setSiteLanguage } from '../../data';

interface ModalFooterProps {
  isLoading: boolean;
  error: boolean;
  close: () => void;
  onSubmit: () => void;
}

/**
 * ModalFooter component for the SiteLanguageModal.
 *
 * @param isLoading - Whether the save operation is in progress.
 * @param error - Whether an error occurred during the save operation.
 * @param close - Callback to close the modal.
 * @param onSubmit - Callback to submit the selected language.
 *
 * @returns {JSX.Element} The rendered ModalFooter component.
 */
const ModalFooter = ({
  isLoading, error, close, onSubmit,
}: ModalFooterProps) => {
  const { formatMessage } = useIntl();

  return (
    <ActionRow>
      {error && (
        <Alert variant="danger">
          {formatMessage(messages.saveErrorMessage)}
        </Alert>
      )}
      <Button variant="tertiary" onClick={close}>
        {formatMessage(messages.cancelButtonText)}
      </Button>
      <StatefulButton
        state={isLoading ? 'pending' : 'default'}
        labels={{
          default: formatMessage(messages.submitButtonText),
          pending: '',
        }}
        onClick={onSubmit}
      />
    </ActionRow>
  );
};

interface SiteLanguageModalProps {
  isOpen: boolean;
  close: () => void;
}

/**
 * Renders a modal dialog for selecting and updating the user's preferred site language.
 *
 * @param isOpen - Whether the modal is open.
 * @param close - Callback to close the modal.
 *
 * @returns {JSX.Element} A modal that allows the user to change their site language. On successful save,
 * reloads the page to apply the new language; on failure, displays an error message in the modal.
 */
export const SiteLanguageModal = ({ isOpen, close }: SiteLanguageModalProps) => {
  const { formatMessage } = useIntl();

  const siteLanguage = useMemo(() => getSiteLanguage(), []);
  const [selectedLanguage, setSelectedLanguage] = useState(siteLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const appContext = useContext(AppContext);
  // @ts-ignore: AuthenticatedUser won't be null because this is only being used within the context of an
  // authenticated user's header
  const username = appContext?.authenticatedUser?.username;

  const onSubmit = async () => {
    if (selectedLanguage === siteLanguage) {
      close();
      return;
    }
    setIsLoading(true);
    setShowError(false);
    try {
      await setSiteLanguage(selectedLanguage, username);
      window.location.reload();
    } catch (error) {
      logError('Failed to set site language', { error });
      setShowError(true);
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setSelectedLanguage(getSiteLanguage());
    close();
  };

  return (
    <StandardModal
      title={formatMessage(messages.modalTitle)}
      isOpen={isOpen}
      onClose={onClose}
      isFullscreenScroll
      footerNode={(
        <ModalFooter
          isLoading={isLoading}
          error={showError}
          close={onClose}
          onSubmit={onSubmit}
        />
      )}
    >
      <LanguageSelector
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </StandardModal>
  );
};
