
import { useTranslation as useI18nTranslation } from 'react-i18next';

const LANGUAGE_STORAGE_KEY = 'app_language';

// Cache pour éviter les recalculs de fallbacks
const fallbackCache = new Map<string, string>();

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();
  
  // Simple t function with improved fallback handling
  const t = (key: string, options?: any): string => {
    // Vérifier le cache d'abord
    const cacheKey = `${key}-${i18n.language}`;
    if (fallbackCache.has(cacheKey)) {
      return fallbackCache.get(cacheKey)!;
    }

    const translated = originalT(key, options);
    
    // Ensure we always return a string
    const translatedString = typeof translated === 'string' ? translated : String(translated);
    
    // If translation is missing (returns key), provide readable fallback
    if (translatedString === key) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation: ${key} for language: ${i18n.language}`);
      }
      
      // Convert key to readable text
      const parts = key.split('.');
      const fallback = parts[parts.length - 1].replace(/([A-Z])/g, ' $1').trim();
      
      // Mettre en cache le fallback
      fallbackCache.set(cacheKey, fallback);
      return fallback;
    }
    
    // Mettre en cache la traduction réussie
    fallbackCache.set(cacheKey, translatedString);
    return translatedString;
  };
  
  // Change language with localStorage persistence and cache clearing
  const changeLanguage = (lng: string) => {
    // Vider le cache lors du changement de langue
    fallbackCache.clear();
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    i18n.changeLanguage(lng);
  };
  
  return { 
    t, 
    changeLanguage, 
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
