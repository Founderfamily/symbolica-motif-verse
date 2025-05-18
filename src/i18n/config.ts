
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
    fallbackLng: {
      'fr': ['en'],
      'en': ['fr'],
      'default': ['fr', 'en']
    },
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
    // Allow returning objects (important for complex translations)
    returnObjects: true,
    parseMissingKeyHandler: (key) => {
      // Format missing keys nicely for display
      return formatKeyAsReadableText(key);
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
    }
  };
}

// Export the i18n instance for direct access to language
export { i18n };
export default i18n;
