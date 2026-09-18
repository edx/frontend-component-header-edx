import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from '.';

jest.mock('./TranslationDisclaimer', () => ({
  TranslationDisclaimer: () => <div data-testid="translation-disclaimer">Disclaimer</div>,
}));

const languages = [
  { code: 'en', name: 'English', released: true },
  { code: 'es', name: 'Español', released: true },
  { code: 'fr', name: 'Français', released: true },
  { code: 'de', name: 'Deutsch', released: true },
  { code: 'it', name: 'Italiano', released: true },
];

describe('LanguageSelector', () => {
  it('renders all language options', () => {
    const setSelectedLanguage = jest.fn();
    render(<LanguageSelector languages={languages} selectedLanguage="en" setSelectedLanguage={setSelectedLanguage} />);
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Español')).toBeInTheDocument();
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('Deutsch')).toBeInTheDocument();
    expect(screen.getByText('Italiano')).toBeInTheDocument();
  });

  it('shows the check icon for the selected language and no others', () => {
    const setSelectedLanguage = jest.fn();
    render(<LanguageSelector languages={languages} selectedLanguage="es" setSelectedLanguage={setSelectedLanguage} />);
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
    render(<LanguageSelector languages={languages} selectedLanguage="en" setSelectedLanguage={setSelectedLanguage} />);
    const spanishRadio = screen.getByText('Español');
    fireEvent.click(spanishRadio);
    expect(setSelectedLanguage).toHaveBeenCalledWith('es');
  });

  it('renders the translation disclaimer', () => {
    const setSelectedLanguage = jest.fn();
    render(<LanguageSelector languages={languages} selectedLanguage="en" setSelectedLanguage={setSelectedLanguage} />);
    expect(screen.getByTestId('translation-disclaimer')).toBeInTheDocument();
  });

  it('renders no options when the language list is empty', () => {
    const setSelectedLanguage = jest.fn();
    render(<LanguageSelector languages={[]} selectedLanguage="en" setSelectedLanguage={setSelectedLanguage} />);
    expect(screen.queryByTestId(/language-option-/)).not.toBeInTheDocument();
    expect(screen.getByTestId('translation-disclaimer')).toBeInTheDocument();
  });
});
