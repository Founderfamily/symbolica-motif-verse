
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { i18n } from './config';
import { useCallback, useState, useEffect } from 'react';

export const useTranslation = () => {
  // Use the underlying react-i18next hook
  const { t, i18n: i18nInstance } = useI18nTranslation();
  
  // Track language changes to force re-renders
  const [currentLanguage, setCurrentLanguage] = useState(i18nInstance.language || 'fr');
  
  // Update currentLanguage when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = (lang: string) => {
      console.log(`Language changed in useTranslation: ${lang}`);
      setCurrentLanguage(lang);
    };
    
    i18nInstance.on('languageChanged', handleLanguageChanged);
    return () => {
      i18nInstance.off('languageChanged', handleLanguageChanged);
    };
  }, [i18nInstance]);
  
  // Function to change the language
  const changeLanguage = useCallback((lang: string) => {
    console.log(`Attempting to change language to: ${lang}`);
    localStorage.setItem('app_language', lang);
    return i18nInstance.changeLanguage(lang).then(() => {
      console.log(`Language successfully changed to: ${lang}`);
      // We don't need to setCurrentLanguage here since the effect will handle it
      return lang;
    });
  }, [i18nInstance]);
  
  // Safely handle translations that might return objects
  const safeT = useCallback((key: string, options?: any) => {
    try {
      const translated = t(key, options);
      
      // If translation is an object, stringify it or return a fallback
      if (translated !== null && typeof translated === 'object') {
        console.warn(`Translation for key "${key}" returned an object instead of a string`, translated);
        
        // Type-safe approach: Use optional chaining and nullish coalescing for object properties
        const objTranslated = translated as Record<string, any>;
        return objTranslated?.text ?? objTranslated?.value ?? objTranslated?.content ?? 
               String(objTranslated) ?? key.split('.').pop() ?? key;
      }
      
      return translated;
    } catch (error) {
      console.error(`Error translating key: ${key}`, error);
      return key;
    }
  }, [t]);
  
  // Add validation function for development environment
  const validateCurrentPageTranslations = useCallback(() => {
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
  }, []);
  
  // Check if a specific key exists in the translation file
  const hasTranslation = useCallback((key: string) => {
    return i18nInstance.exists(key);
  }, [i18nInstance]);
  
  // Simplified API that focuses only on i18n functionality
  return {
    t: safeT, // Use our safe translation function
    originalT: t, // Keep the original for advanced use cases
    i18n: i18nInstance,
    currentLanguage,
    changeLanguage,
    validateCurrentPageTranslations,
    hasTranslation
  };
};

export default useTranslation;
