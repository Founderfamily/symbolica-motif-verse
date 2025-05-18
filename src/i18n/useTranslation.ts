
import { useTranslation as useI18nTranslation } from 'react-i18next';
import { validateKeyFormat, formatKeyAsReadableText, keyExistsInBothLanguages } from './translationUtils';
import { useEffect, useCallback, useMemo } from 'react';

// Store the current language in localStorage to ensure consistent language across page loads
const LANGUAGE_STORAGE_KEY = 'app_language';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();
  
  // Force language detection on component mount - runs once per component
  useEffect(() => {
    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    
    if (savedLang && ['fr', 'en'].includes(savedLang)) {
      // If the current language doesn't match the saved one, update it
      if (i18n.language !== savedLang) {
        console.log(`Language mismatch detected. Setting language from ${i18n.language} to saved preference: ${savedLang}`);
        i18n.changeLanguage(savedLang);
      }
    } else if (i18n.language !== 'fr' && i18n.language !== 'en') {
      // Detect browser language or default to French if current language is invalid
      const browserLang = navigator.language.split('-')[0];
      const detectedLang = ['fr', 'en'].includes(browserLang) ? browserLang : 'fr';
      
      console.log(`No language preference found. Detecting from browser: ${detectedLang}`);
      
      // Save and set the language
      localStorage.setItem(LANGUAGE_STORAGE_KEY, detectedLang);
      i18n.changeLanguage(detectedLang);
    }
  }, [i18n]);
  
  // Enhanced t function with better fallbacks - memoized to avoid recreating on each render
  const t = useCallback((key: string, options?: any): string => {
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
  }, [originalT]);
  
  // Change language and save preference - memoized to prevent recreation
  const changeLanguage = useCallback((lng: string) => {
    console.log(`Changing language to: ${lng}`);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    i18n.changeLanguage(lng);
  }, [i18n]);
  
  // Force refresh of the language from localStorage - memoized
  const refreshLanguage = useCallback(() => {
    const savedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLang && ['fr', 'en'].includes(savedLang) && i18n.language !== savedLang) {
      console.log(`Refreshing language from localStorage: ${savedLang}`);
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);
  
  // Validate translations on the current page - memoized
  const validateCurrentPageTranslations = useCallback(() => {
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
  }, [i18n]);
  
  // Use memo to create a stable object reference for the return value
  return useMemo(() => ({ 
    t, 
    changeLanguage, 
    currentLanguage: i18n.language, 
    i18n,
    refreshLanguage,
    validateCurrentPageTranslations
  }), [t, changeLanguage, i18n, refreshLanguage, validateCurrentPageTranslations]);
};

// Function to switch language programmatically from anywhere
export const switchLanguage = (lang: 'fr' | 'en') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    
    // Instead of reloading, just change the language
    // This provides a smoother experience
    if (window.i18next) {
      window.i18next.changeLanguage(lang);
    }
  }
};

// Add type declaration for the i18next property on the window object
declare global {
  interface Window {
    i18next: any;
  }
}
