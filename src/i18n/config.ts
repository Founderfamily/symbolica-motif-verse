
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
    },
    // Add more verbose logging in development
    debug: process.env.NODE_ENV === 'development'
  });

// Add a global utility to check translation coverage
if (process.env.NODE_ENV === 'development') {
  (window as any).checkTranslations = () => {
    const event = new CustomEvent('validate-translations');
    window.dispatchEvent(event);
  };
  
  // Register keyboard shortcut: Ctrl+Alt+T to check translations
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.altKey && e.code === 'KeyT') {
      (window as any).checkTranslations();
    }
  });
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
        total: {
          fr: frKeys.length,
          en: enKeys.length
        }
      };
    },
    
    // Add a translation directly during development
    addTranslation: (key: string, value: string, lang: 'fr' | 'en') => {
      i18n.addResource(lang, 'translation', key, value);
      console.log(`Added translation for ${key} in ${lang}`);
    },
    
    // Check for unused keys (this is an approximation)
    findUnusedKeys: () => {
      const allKeys = [...Object.keys(flattenObject(fr)), ...Object.keys(flattenObject(en))];
      const uniqueKeys = [...new Set(allKeys)];
      
      console.log(`Found ${uniqueKeys.length} unique keys in translation files`);
      console.log('Run checkTranslations() to find missing keys in the UI');
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
