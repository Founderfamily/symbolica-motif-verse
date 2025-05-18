
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { i18n } from './config';

export const useTranslation = () => {
  // Use the underlying react-i18next hook
  const { t, i18n: i18nInstance } = useI18nTranslation();
  
  // Get the current language
  const currentLanguage = i18nInstance.language || 'fr';
  
  // Function to change the language
  const changeLanguage = (lang: string) => {
    return i18nInstance.changeLanguage(lang);
  };
  
  // Simplified API that focuses only on i18n functionality
  return {
    t,
    i18n: i18nInstance,
    currentLanguage,
    changeLanguage
  };
};

export default useTranslation;
