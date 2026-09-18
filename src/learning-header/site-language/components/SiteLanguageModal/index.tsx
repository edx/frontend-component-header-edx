import {
  useState, useContext, useEffect, useMemo,
} from 'react';

import './SiteLanguageModal.scss';
import { useIntl, getLocale } from '@edx/frontend-platform/i18n';
import { AppContext } from '@edx/frontend-platform/react';
import { logError } from '@edx/frontend-platform/logging';
import {
  ActionRow,
  Alert,
  Button,
  Spinner,
  StatefulButton,
  StandardModal,
} from '@openedx/paragon';

import messages from '../../messages';
import { LanguageSelector } from '../LanguageSelector';
import { fetchReleasedLanguages, setSiteLanguage, SiteLanguage } from '../../data';

interface ModalFooterProps {
  isLoading: boolean;
  error: boolean;
  canSubmit: boolean;
  close: () => void;
  onSubmit: () => void;
}

/**
 * ModalFooter component for the SiteLanguageModal.
 *
 * @param isLoading - Whether the save operation is in progress.
 * @param error - Whether an error occurred during the save operation.
 * @param canSubmit - Whether there is a loaded language list to submit against.
 * @param close - Callback to close the modal.
 * @param onSubmit - Callback to submit the selected language.
 *
 * @returns {JSX.Element} The rendered ModalFooter component.
 */
const ModalFooter = ({
  isLoading, error, canSubmit, close, onSubmit,
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
        disabled={!canSubmit}
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

interface AuthenticatedUser {
  username: string;
}

interface AppContextType {
  authenticatedUser?: AuthenticatedUser;
}

/**
 * Renders a modal dialog for selecting and updating the user's preferred site language.
 *
 * @param isOpen - Whether the modal is open.
 * @param close - Callback to close the modal.
 *
 * @returns {JSX.Element} A modal that allows the user to change their site language. The list of
 * languages is fetched from the LMS released-languages endpoint the first time the modal opens.
 * On successful save, reloads the page to apply the new language; on failure, displays an error
 * message in the modal.
 */
export const SiteLanguageModal = ({ isOpen, close }: SiteLanguageModalProps) => {
  const { formatMessage } = useIntl();

  const siteLanguage = useMemo(() => getLocale(), []);
  const [selectedLanguage, setSelectedLanguage] = useState(siteLanguage);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const [languages, setLanguages] = useState<SiteLanguage[] | null>(null);
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(false);
  const [showLoadError, setShowLoadError] = useState(false);

  const appContext = useContext(AppContext) as AppContextType;
  const username = appContext.authenticatedUser?.username ?? '';

  // Fetch the released languages the first time the modal opens. If the fetch fails, `languages`
  // stays null so the next open retries.
  useEffect(() => {
    if (!isOpen || languages !== null) {
      return undefined;
    }
    let isCancelled = false;
    setIsLoadingLanguages(true);
    setShowLoadError(false);
    fetchReleasedLanguages()
      .then((releasedLanguages) => {
        if (isCancelled) { return; }
        setLanguages(releasedLanguages);
        // The site language may no longer be released (DarkLangConfig can change, and beta
        // languages are filtered out), which would leave no option selected and make the
        // user's own language unselectable. Fall back to the first available language.
        if (releasedLanguages.length > 0
          && !releasedLanguages.some(language => language.code === siteLanguage)) {
          setSelectedLanguage(releasedLanguages[0].code);
        }
        setIsLoadingLanguages(false);
      })
      .catch((error) => {
        if (isCancelled) { return; }
        logError('Failed to fetch released site languages', { error });
        setShowLoadError(true);
        setIsLoadingLanguages(false);
      });
    return () => { isCancelled = true; };
  }, [isOpen, languages, siteLanguage]);

  const onSubmit = async () => {
    if (selectedLanguage === siteLanguage) {
      close();
      return;
    }
    setIsLoading(true);
    setShowError(false);
    try {
      await setSiteLanguage(selectedLanguage, username, languages ?? []);
      window.location.reload();
    } catch (error) {
      logError('Failed to set site language', { error });
      setShowError(true);
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setSelectedLanguage(siteLanguage);
    // Clear both error states so reopening does not flash a stale error before the retry.
    setShowError(false);
    setShowLoadError(false);
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
          canSubmit={languages !== null && languages.length > 0}
          close={onClose}
          onSubmit={onSubmit}
        />
      )}
    >
      {isLoadingLanguages && (
        <div className="d-flex justify-content-center p-4" data-testid="site-language-loading">
          <Spinner animation="border" screenReaderText={formatMessage(messages.loadingLanguagesText)} />
        </div>
      )}
      {showLoadError && (
        <Alert variant="danger">
          {formatMessage(messages.loadLanguagesErrorMessage)}
        </Alert>
      )}
      {languages !== null && languages.length === 0 && (
        <Alert variant="warning" data-testid="site-language-empty">
          {formatMessage(messages.noLanguagesMessage)}
        </Alert>
      )}
      {languages !== null && languages.length > 0 && (
        <LanguageSelector
          languages={languages}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
        />
      )}
    </StandardModal>
  );
};
