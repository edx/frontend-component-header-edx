import React from 'react';
import { SelectableBox, Stack, Icon } from '@openedx/paragon';
import { Check } from '@openedx/paragon/icons';
import TranslationDisclaimer from './TranslationDisclaimer.tsx';
import { TRANSLATION_LANGUAGES } from './languagesList';

interface LanguageSelectorProps {
  selectedLanguage: string;
  setSelectedLanguage: (_language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  setSelectedLanguage,
}) => {
  const handleChange = (e) => setSelectedLanguage(e.target.value);
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
        {TRANSLATION_LANGUAGES.map(({ code, label, localeName }) => (
          <SelectableBox
            key={code}
            value={code}
            aria-label={`${label} radio`}
            className="option shadow-none"
          >
            <Stack gap={3} direction="horizontal">
              {localeName}
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

export default LanguageSelector;
