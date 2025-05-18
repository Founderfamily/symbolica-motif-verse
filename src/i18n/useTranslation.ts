
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
  
  // Add validation function for development environment
  const validateCurrentPageTranslations = () => {
    if (process.env.NODE_ENV === 'development') {
      // Find all elements with data-i18n-key attribute
      const translationElements = document.querySelectorAll('[data-i18n-key]');
      
      // Log translation validation results
      console.group('Translation validation');
      console.log(`Found ${translationElements.length} translated elements on current page`);
      
      // Check for missing translations
      const missingTranslations = Array.from(translationElements)
        .filter(el => el.getAttribute('data-i18n-missing') === 'true')
        .map(el => el.getAttribute('data-i18n-key'));
        
      if (missingTranslations.length > 0) {
        console.warn(`Missing ${missingTranslations.length} translations:`, missingTranslations);
      } else {
        console.log('✅ All translations found for current page');
      }
      
      console.groupEnd();
      
      return {
        total: translationElements.length,
        missing: missingTranslations,
        complete: translationElements.length - missingTranslations.length
      };
    }
    
    // Return empty result for production
    return { total: 0, missing: [], complete: 0 };
  };
  
  // Simplified API that focuses only on i18n functionality
  return {
    t,
    i18n: i18nInstance,
    currentLanguage,
    changeLanguage,
    validateCurrentPageTranslations
  };
};

export default useTranslation;
