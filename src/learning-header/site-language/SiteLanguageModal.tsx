import { useState, useContext } from 'react';

import './SiteLanguageModal.scss';
import { useIntl } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import {
  ActionRow,
  Alert,
  Button,
  StatefulButton,
  StandardModal,
} from '@openedx/paragon';

import messages from './messages';
import LanguageSelector from './LanguageSelector.tsx';
import { getSiteLanguage, setSiteLanguage } from './data.ts';

interface ModalFooterProps {
  isLoading: boolean;
  error: boolean;
  close: () => void;
  onSubmit: () => void;
}

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
 */
const SiteLanguageModal = ({ isOpen, close }: SiteLanguageModalProps) => {
  const { formatMessage } = useIntl();

  const [selectedLanguage, setSelectedLanguage] = useState(getSiteLanguage());
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const appContext = useContext(AppContext);
  // @ts-ignore: AuthenticatedUser won't be null because this is only being used within the context of an
  // authenticated user's header
  const username = appContext?.authenticatedUser?.username;

  const onSubmit = async () => {
    if (selectedLanguage === getSiteLanguage()) {
      close();
      return;
    }
    setIsLoading(true);
    setShowError(false);
    try {
      await setSiteLanguage(selectedLanguage, username);
      window.location.reload();
    } catch (error) {
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

export default SiteLanguageModal;
