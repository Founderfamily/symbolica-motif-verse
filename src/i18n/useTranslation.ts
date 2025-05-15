
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { validateTranslationKey } from './useTranslationValidator';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();
  
  // Wrap the original t function to validate keys in development
  // and ensure we always return a string
  const t = (key: string, options?: any): string => {
    // Validate the key in development
    if (process.env.NODE_ENV === 'development') {
      validateTranslationKey(key);
    }
    
    // Call the original t function and ensure it returns a string
    const translated = originalT(key, options);
    // Convert any non-string values to string to avoid type issues
    return typeof translated === 'string' ? translated : String(translated);
  };
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return { t, changeLanguage, currentLanguage: i18n.language, i18n };
};
