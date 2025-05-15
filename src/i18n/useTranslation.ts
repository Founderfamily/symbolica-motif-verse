
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
      
      // Enhanced developer experience - warn when a key might be mistyped or missing
      const translated = originalT(key, options);
      if (translated === key) {
        console.warn(`⚠️ Possible missing translation for key: '${key}'`);
        // Detect similar keys that might be typos
        suggestSimilarKeys(key);
      }
    }
    
    // Call the original t function and ensure it returns a string
    const translated = originalT(key, options);
    // Convert any non-string values to string to avoid type issues
    return typeof translated === 'string' ? translated : String(translated);
  };
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  // A helper function to check if we're missing any translations on the current page
  const validateCurrentPageTranslations = () => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Translation validation is only available in development mode');
      return;
    }
    
    // Create or toggle the translations panel
    const event = new CustomEvent('validate-translations');
    window.dispatchEvent(event);
  };
  
  return { 
    t, 
    changeLanguage, 
    currentLanguage: i18n.language, 
    i18n,
    validateCurrentPageTranslations
  };
};

/**
 * Helper function to suggest similar keys when a key might be mistyped
 */
const suggestSimilarKeys = (key: string) => {
  try {
    // This would be implemented to search through the translation objects
    // for keys that are similar to the provided key
    // For now, just a placeholder
    const similarKeys: string[] = [];
    
    if (similarKeys.length > 0) {
      console.info('🔍 Similar translation keys found:');
      similarKeys.forEach(similarKey => {
        console.info(`  - ${similarKey}`);
      });
    }
  } catch (error) {
    // Silently fail for suggestion feature
  }
};
