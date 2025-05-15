
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { validateTranslationKey } from './useTranslationValidator';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();
  
  // Wrap the original t function to validate keys in development
  const t = (key: string, options?: any) => {
    // Validate the key in development
    if (process.env.NODE_ENV === 'development') {
      validateTranslationKey(key);
    }
    
    // Call the original t function
    return originalT(key, options);
  };
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return { t, changeLanguage, currentLanguage: i18n.language, i18n };
};
