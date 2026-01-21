import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from './LanguageSelector';

jest.mock('./TranslationDisclaimer', () => ({
  TranslationDisclaimer: () => <div data-testid="translation-disclaimer">Disclaimer</div>,
}));

jest.mock('./languagesList', () => ({
  TRANSLATION_LANGUAGES: [
    { code: 'en', label: 'English', localeName: 'English' },
    { code: 'es', label: 'Spanish', localeName: 'Español' },
    { code: 'fr', label: 'French', localeName: 'Français' },
    { code: 'de', label: 'German', localeName: 'Deutsch' },
    { code: 'it', label: 'Italian', localeName: 'Italiano' },
  ],
}));

describe('LanguageSelector', () => {
  it('renders all language options', () => {
    const setSelectedLanguage = jest.fn();
    render(<LanguageSelector selectedLanguage="en" setSelectedLanguage={setSelectedLanguage} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
    expect(screen.getByText('Italiano')).toBeInTheDocument();
  });

  it('shows the check icon for the selected language and no others', () => {
    const setSelectedLanguage = jest.fn();
    render(<LanguageSelector selectedLanguage="es" setSelectedLanguage={setSelectedLanguage} />);
    const selectedOption = screen.getByText('Español');
    expect(selectedOption.querySelector('.text-success')).toBeInTheDocument();
    screen.getAllByText(/Español|Français|Deutsch|Italiano/).forEach((option) => {
      if (option !== selectedOption) {
        expect(option.querySelector('.text-success')).not.toBeInTheDocument();
      }
    });
  });

  it('calls setSelectedLanguage when a different language is selected', () => {
    const setSelectedLanguage = jest.fn();
    render(<LanguageSelector selectedLanguage="en" setSelectedLanguage={setSelectedLanguage} />);
    const spanishRadio = screen.getByText('Español');
    fireEvent.click(spanishRadio);
    expect(setSelectedLanguage).toHaveBeenCalledWith('es');
  });

  it('renders the translation disclaimer', () => {
    const setSelectedLanguage = jest.fn();
    render(<LanguageSelector selectedLanguage="en" setSelectedLanguage={setSelectedLanguage} />);
    expect(screen.getByTestId('translation-disclaimer')).toBeInTheDocument();
  });
});
