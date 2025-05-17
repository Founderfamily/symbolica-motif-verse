
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { validateKeyFormat, formatKeyAsReadableText, keyExistsInBothLanguages } from './translationUtils';

// Store the current language in localStorage to ensure consistent language across page loads
const LANGUAGE_STORAGE_KEY = 'app_language';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();
  
  // Force language detection on first load
  const initializeLanguage = () => {
    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    
    if (savedLang && ['fr', 'en'].includes(savedLang)) {
      i18n.changeLanguage(savedLang);
    } else {
      // Detect browser language or default to French
      const browserLang = navigator.language.split('-')[0];
      const detectedLang = ['fr', 'en'].includes(browserLang) ? browserLang : 'fr';
      
      // Save and set the language
      localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLang);
      i18n.changeLanguage(detectedLang);
    }
  };
  
  // Initialize language on first load
  if (typeof window !== 'undefined' && !localStorage.getItem(LANGUAGE_STORAGE_KEY)) {
    initializeLanguage();
  }
  
  // Enhanced t function with better fallbacks
  const t = (key: string, options?: any): string => {
    // Validate the key in development
    if (process.env.NODE_ENV === 'development') {
      if (!validateKeyFormat(key)) {
        console.warn(`⚠️ Translation key '${key}' doesn't follow the format convention.`);
      }
    }
    
    // Call the original t function 
    const translated = originalT(key, options);
    
    // Handle case where translation is missing (returns key)
    if (translated === key) {
      // In development, log missing keys
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ Missing translation for key: '${key}'`);
      }
      
      // Return a formatted version of the key for better readability in production
      return formatKeyAsReadableText(key);
    }
    
    // Ensure string output
    return typeof translated === 'string' ? translated : String(translated);
  };
  
  // Change language and save preference
  const changeLanguage = (lng: string) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    i18n.changeLanguage(lng);
  };
  
  // Validate translations on the current page
  const validateCurrentPageTranslations = () => {
    if (process.env.NODE_ENV !== 'development') {
      return; // Only run in development
    }
    
    // Get all elements with data-i18n-key attribute
    const translatedElements = document.querySelectorAll('[data-i18n-key]');
    const usedKeys = Array.from(translatedElements).map(el => 
      (el as HTMLElement).getAttribute('data-i18n-key') || ''
    );
    
    console.log(`Translation validation: Found ${usedKeys.length} keys on current page`);
    
    // Check each key for both languages
    const missingInLanguages: Record<string, string[]> = {
      en: [],
      fr: []
    };
    
    usedKeys.forEach(key => {
      if (!i18n.exists(key, { lng: 'en' })) {
        missingInLanguages.en.push(key);
      }
      
      if (!i18n.exists(key, { lng: 'fr' })) {
        missingInLanguages.fr.push(key);
      }
    });
    
    // Log results
    if (missingInLanguages.en.length > 0) {
      console.warn(`⚠️ Missing ${missingInLanguages.en.length} English translations:`, missingInLanguages.en);
    }
    
    if (missingInLanguages.fr.length > 0) {
      console.warn(`⚠️ Missing ${missingInLanguages.fr.length} French translations:`, missingInLanguages.fr);
    }
    
    if (missingInLanguages.en.length === 0 && missingInLanguages.fr.length === 0) {
      console.log('✅ All translations for this page are complete!');
    }
    
    return {
      usedKeys,
      missingInLanguages
    };
  };
  
  return { 
    t, 
    changeLanguage, 
    currentLanguage: i18n.language, 
    i18n,
    // Utility for debugging
    refreshLanguage: initializeLanguage,
    validateCurrentPageTranslations
  };
};

// Function to switch language programmatically from anywhere
export const switchLanguage = (lang: 'fr' | 'en') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    
    // Instead of reloading, just change the language
    // This provides a smoother experience
    const i18nInstance = window.i18n;
    if (i18nInstance) {
      i18nInstance.changeLanguage(lang);
    }
  }
};
