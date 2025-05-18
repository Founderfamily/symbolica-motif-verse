
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { i18n } from './config';
import { useState, useCallback } from 'react';

export const useTranslation = () => {
  // Use the underlying react-i18next hook
  const { t, i18n: i18nInstance } = useI18nTranslation();
  const [translationErrors, setTranslationErrors] = useState<string[]>([]);
  
  // Get the current language
  const currentLanguage = i18nInstance.language || 'fr';
  
  // Function to change the language
  const changeLanguage = (lang: string) => {
    return i18nInstance.changeLanguage(lang);
  };
  
  // Function to validate translations on the current page
  const validateCurrentPageTranslations = useCallback(() => {
    console.log('Validating translations on current page...');
    
    // Trigger a custom event to activate the translation debugger
    const event = new CustomEvent('validate-translations');
    window.dispatchEvent(event);
    
    // Return a promise that resolves when validation is complete
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 100);
    });
  }, []);
  
  return {
    t,
    i18n: i18nInstance,
    translationErrors,
    currentLanguage,
    changeLanguage,
    validateCurrentPageTranslations
  };
};

export default useTranslation;
