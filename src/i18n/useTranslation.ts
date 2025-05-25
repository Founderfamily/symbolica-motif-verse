
import { useTranslation as useI18nTranslation } from 'react-i18next';

const LANGUAGE_STORAGE_KEY = 'app_language';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();
  
  // Simplified t function that relies on i18next's native behavior
  const t = (key: string, options?: any): string => {
    const translated = originalT(key, options);
    
    // Ensure we always return a string
    const translatedString = typeof translated === 'string' ? translated : String(translated);
    
    // If translation is missing (returns key), provide readable fallback in same language
    if (translatedString === key) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key} for language: ${i18n.language}`);
      }
      
      // Convert key to readable text
      const parts = key.split('.');
      return parts[parts.length - 1].replace(/([A-Z])/g, ' $1').trim();
    }
    
    return translatedString;
  };
  
  // Change language with localStorage persistence
  const changeLanguage = (lng: string) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    i18n.changeLanguage(lng);
  };

  // Reset to default language (English)
  const resetToDefaultLanguage = () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    i18n.changeLanguage('en');
  };
  
  return { 
    t, 
    changeLanguage,
    resetToDefaultLanguage,
    currentLanguage: i18n.language, 
    i18n
  };
};

// Simple language switcher function
export const switchLanguage = (lang: 'fr' | 'en') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    window.location.reload();
  }
};
