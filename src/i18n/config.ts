import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// French translations - modular structure
import frApp from './locales/fr/app.json';
import frHero from './locales/fr/hero.json';
import frSections from './locales/fr/sections.json';
import frFeatures from './locales/fr/features.json';
import frQuickAccess from './locales/fr/quickAccess.json';
import frCallToAction from './locales/fr/callToAction.json';
import frHowItWorks from './locales/fr/howItWorks.json';
import frUploadTools from './locales/fr/uploadTools.json';
import frAuth from './locales/fr/auth.json';
import frAdmin from './locales/fr/admin.json';
import frCollections from './locales/fr/collections.json';
import frCommunity from './locales/fr/community.json';
import frProfile from './locales/fr/profile.json';
import frNavigation from './locales/fr/navigation.json';
import frCommon from './locales/fr/common.json';
import frContributions from './locales/fr/contributions.json';
import frGamification from './locales/fr/gamification.json';
import frSymbols from './locales/fr/symbols.json';
import frSearchFilters from './locales/fr/searchFilters.json';

// Import remaining sections from original file
import frTranslationRemaining from './locales/fr.json';

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

// Merge all French translation files with consistent structure
const frTranslation = {
  ...frNavigation,
  ...frCommon,
  app: frApp,
  hero: frHero,
  sections: frSections,
  features: frFeatures,
  quickAccess: frQuickAccess,
  callToAction: frCallToAction,
  howItWorks: frHowItWorks,
  uploadTools: frUploadTools,
  auth: frAuth.auth,
  admin: frAdmin.admin,
  collections: frCollections,
  community: frCommunity,
  profile: frProfile.profile,
  contributions: frContributions.contributions,
  gamification: frGamification.gamification,
  symbols: frSymbols,
  searchFilters: frSearchFilters.searchFilters,
  // Keep remaining translations from original file for backward compatibility
  testimonials: frTranslationRemaining.testimonials,
  about: frTranslationRemaining.about,
  faq: frTranslationRemaining.faq,
  roadmap: frTranslationRemaining.roadmap,
  symbolTriptych: frTranslationRemaining.symbolTriptych
};

// Merge all English translation files with consistent structure
const enTranslation = {
  ...enNavigation,
  ...enCommon,
  auth: enAuth.auth,
  profile: enProfile.profile,
  ...enSections,
  contributions: enContributions.contributions,
  symbols: enSymbols,
  gamification: enGamification.gamification,
  admin: enAdmin.admin,
  collections: enCollections,
  searchFilters: enSearchFilters.searchFilters
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
