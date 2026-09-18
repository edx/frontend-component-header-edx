import React from 'react';
import { SelectableBox, Stack, Icon } from '@openedx/paragon';
import { Check } from '@openedx/paragon/icons';
import { TranslationDisclaimer } from './TranslationDisclaimer';
import { SiteLanguage } from '../../data';

interface LanguageSelectorProps {
  languages: SiteLanguage[];
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

/**
 * LanguageSelector component for selecting a site language.
 *
 * @param languages - The released site languages to offer, from the LMS released-languages endpoint.
 * @param selectedLanguage - The currently selected language.
 * @param setSelectedLanguage - Callback to update the selected language.
 *
 * @returns {JSX.Element} The rendered LanguageSelector component.
 */

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSelectedLanguage(e.target.value);
  return (
    <div className="pgn__card small">
      <SelectableBox.Set
        value={selectedLanguage}
        onChange={handleChange}
        name="languages"
        columns={1}
        ariaLabel="language selection"
        className="language-set"
      >
        {languages.map(({ code, name }) => (
          <SelectableBox
            data-testid={`language-option-${code}`}
            key={code}
            value={code}
            aria-label={`${name} radio`}
            className="option shadow-none"
          >
            <Stack gap={3} direction="horizontal">
              {name}
              {selectedLanguage === code && <Icon src={Check} className="text-success" />}
            </Stack>
          </SelectableBox>
        ))}
      </SelectableBox.Set>
      <div className="p-3">
        <TranslationDisclaimer />
      </div>
    </div>
  );
};
