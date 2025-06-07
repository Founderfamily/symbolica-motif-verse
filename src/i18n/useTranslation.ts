
import { useTranslation as useI18nTranslation } from 'react-i18next';

const LANGUAGE_STORAGE_KEY = 'app_language';

export const useTranslation = () => {
  const { t: originalT, i18n } = useI18nTranslation();
  
  // Enhanced t function with better namespace and fallback handling
  const t = (key: string, options?: any): string => {
    // Handle namespace properly
    let translationKey = key;
    let namespace = options?.ns;
    
    // If no namespace provided and key contains dots, try to extract it
    if (!namespace && key.includes('.')) {
      const parts = key.split('.');
      if (parts.length >= 2) {
        // Try the first part as namespace
        namespace = parts[0];
        translationKey = parts.slice(1).join('.');
      }
    }
    
    // Try translation with namespace first
    if (namespace) {
      const namespacedResult = originalT(translationKey, { ...options, ns: namespace });
      if (namespacedResult !== translationKey && namespacedResult !== key) {
        return namespacedResult;
      }
    }
    
    // Fallback to original key without namespace
    const directResult = originalT(key, options);
    if (directResult !== key) {
      return directResult;
    }
    
    // If still no translation found, provide readable fallback
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation: ${key} (namespace: ${namespace || 'none'}) for language: ${i18n.language}`);
    }
    
    // Convert key to readable text as last resort
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];
    return lastPart.replace(/([A-Z])/g, ' $1').trim();
  };
  
  // Change language with localStorage persistence
  const changeLanguage = (lng: string) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
    i18n.changeLanguage(lng);
  };

  // Reset to default language (French)
  const resetToDefaultLanguage = () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    i18n.changeLanguage('fr');
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
