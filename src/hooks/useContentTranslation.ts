
import { useTranslation } from '@/i18n/useTranslation';
import { getTranslatedField, getTranslatedArray, hasTranslation, getBestLanguage } from '@/utils/translationUtils';

/**
 * Custom hook that combines i18n translations with database content translations
 * Makes it easy to use both systems in components
 */
export const useContentTranslation = () => {
  const { t, currentLanguage, i18n } = useTranslation();
  
  return {
    // Standard i18n translation function
    t,
    
    // Current language from i18n
    currentLanguage,
    
    // i18n instance
    i18n,
    
    // Database content translation utilities
    getTranslatedField,
    getTranslatedArray,
    hasTranslation,
    getBestLanguage,
    
    // Shorthand for getTranslatedField
    tf: <T>(obj: any, field: string, fallback = 'en') => 
      getTranslatedField<T>(obj, field, fallback),
      
    // Shorthand for getTranslatedArray
    ta: (obj: any, field: string, fallback = 'en') =>
      getTranslatedArray(obj, field, fallback)
  };
};
