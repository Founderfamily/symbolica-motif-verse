
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import en from './locales/en.json';
import { formatKeyAsReadableText } from './translationUtils';

// Storage key for consistent language across sessions
const LANGUAGE_STORAGE_KEY = 'app_language';

// Initialize the translation system
i18n
  // Browser language detection
  .use(LanguageDetector)
  // React integration
  .use(initReactI18next)
  // Configuration
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en },
    },
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY
    },
    load: 'languageOnly', // Strip region code (en-US -> en)
    saveMissing: process.env.NODE_ENV === 'development', // Enable capturing missing translations
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    },
    // Better fallback handling - prevent keys from being used as values
    returnNull: false,
    returnEmptyString: false,
    parseMissingKeyHandler: (key) => {
      // Format missing keys nicely for display
      return formatKeyAsReadableText(key);
    },
    // Fallback behavior to ensure language consistency
    fallbackLng: {
      'fr': ['en'],
      'en': ['fr'],
      'default': ['fr', 'en']
    },
    // More verbose logging in development
    debug: process.env.NODE_ENV === 'development'
  });

// Add a language toggle helper to the window object
if (process.env.NODE_ENV === 'development') {
  (window as any).i18nTools = {
    toggleLanguage: () => {
      const currentLang = i18n.language;
      const newLang = currentLang === 'fr' ? 'en' : 'fr';
      i18n.changeLanguage(newLang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      console.log(`Language switched to: ${newLang}`);
    },
    
    // Check the current language
    getCurrentLanguage: () => {
      console.log(`Current language: ${i18n.language}`);
      console.log(`Stored language: ${localStorage.getItem(LANGUAGE_STORAGE_KEY)}`);
      return i18n.language;
    },
    
    // Force reload translations
    reloadTranslations: () => {
      const currentLang = i18n.language;
      i18n.reloadResources().then(() => {
        console.log(`Translations reloaded for: ${currentLang}`);
      });
    },
    
    // Check missing translations
    checkMissingTranslations: () => {
      const event = new CustomEvent('validate-translations');
      window.dispatchEvent(event);
    },
    
    // Get all missing keys
    getMissingKeys: () => {
      // This is a simple check, not exhaustive
      const components = document.querySelectorAll('[data-i18n-missing="true"]');
      const missingKeys = Array.from(components).map(el => 
        (el as HTMLElement).getAttribute('data-i18n-key') || ''
      );
      console.log(`Found ${missingKeys.length} missing translation keys:`, missingKeys);
      return missingKeys;
    }
  };
  
  // Add keyboard shortcut to toggle language (Ctrl+Alt+L)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.code === 'KeyL') {
      (window as any).i18nTools.toggleLanguage();
    }
  });
  
  // Add keyboard shortcut to check translations (Ctrl+Alt+T)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.code === 'KeyT') {
      (window as any).i18nTools.checkMissingTranslations();
    }
  });
}

// Export the i18n instance for direct access to language
export { i18n };
export default i18n;
