
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// French translations
import frTranslation from './locales/fr.json';

// English translations - split into thematic files
import enNavigation from './locales/en/navigation.json';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enProfile from './locales/en/profile.json';
import enSections from './locales/en/sections.json';
import enContributions from './locales/en/contributions.json';
import enSymbols from './locales/en/symbols.json';
import enGamification from './locales/en/gamification.json';
import enAdmin from './locales/en/admin.json';
import enCollections from './locales/en/collections.json';
import enSearchFilters from './locales/en/searchFilters.json';

const LANGUAGE_STORAGE_KEY = 'app_language';

// Merge all English translation files
const enTranslation = {
  ...enNavigation,
  ...enCommon,
  ...enAuth,
  ...enProfile,
  ...enSections,
  ...enContributions,
  ...enSymbols,
  ...enGamification,
  ...enAdmin,
  ...enCollections,
  ...enSearchFilters
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: frTranslation },
      en: { translation: enTranslation },
    },
    lng: 'fr',
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY
    },
    load: 'languageOnly',
    returnNull: false,
    returnEmptyString: false,
    parseMissingKeyHandler: (key) => {
      const parts = key.split('.');
      return parts[parts.length - 1].replace(/([A-Z])/g, ' $1').trim();
    },
    debug: process.env.NODE_ENV === 'development',
    saveMissing: false,
    initImmediate: false,
    react: {
      useSuspense: false
    }
  });

export default i18n;
