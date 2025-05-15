
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr.json';
import en from './locales/en.json';

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
      lookupLocalStorage: 'i18nextLng'
    },
    load: 'languageOnly', // Strip region code (en-US -> en)
    saveMissing: process.env.NODE_ENV === 'development', // Enable capturing missing translations
    missingKeyHandler: (lng, ns, key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Missing translation key: ${key} for language: ${lng}`);
      }
    }
  });

// Add a global utility to check translation coverage
if (process.env.NODE_ENV === 'development') {
  (window as any).checkTranslations = () => {
    const event = new CustomEvent('validate-translations');
    window.dispatchEvent(event);
  };
}

export default i18n;
