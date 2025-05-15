
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

// Add helpful developer utilities
if (process.env.NODE_ENV === 'development') {
  (window as any).i18nDebug = {
    // Get all loaded translations
    getTranslations: () => {
      return {
        fr: fr,
        en: en
      };
    },
    
    // Compare keys between languages
    compareKeys: () => {
      const frKeys = Object.keys(flattenObject(fr));
      const enKeys = Object.keys(flattenObject(en));
      
      const onlyInFr = frKeys.filter(k => !enKeys.includes(k));
      const onlyInEn = enKeys.filter(k => !frKeys.includes(k));
      
      return {
        onlyInFr,
        onlyInEn,
        missingInEn: onlyInFr,
        missingInFr: onlyInEn,
      };
    },
    
    // Add a translation directly during development
    addTranslation: (key: string, value: string, lang: 'fr' | 'en') => {
      i18n.addResource(lang, 'translation', key, value);
      console.log(`Added translation for ${key} in ${lang}`);
    }
  };
}

// Helper function to flatten nested objects
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  return Object.keys(obj).reduce((acc: Record<string, string>, k) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], `${pre}${k}`));
    } else {
      acc[`${pre}${k}`] = obj[k];
    }
    return acc;
  }, {});
}

export default i18n;
