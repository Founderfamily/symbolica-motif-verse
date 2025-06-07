
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import fallback translation files
import enTranslations from './locales/en.json';
import frTranslations from './locales/fr.json';

// Import namespace-specific translations
import enApp from './locales/en/app.json';
import frApp from './locales/fr/app.json';
import enAuth from './locales/en/auth.json';
import frAuth from './locales/fr/auth.json';
import enAdmin from './locales/en/admin.json';
import frAdmin from './locales/fr/admin.json';
import enHeader from './locales/en/header.json';
import frHeader from './locales/fr/header.json';
import enProfile from './locales/en/profile.json';
import frProfile from './locales/fr/profile.json';
import enNavigation from './locales/en/navigation.json';
import frNavigation from './locales/fr/navigation.json';
import enSearch from './locales/en/search.json';
import frSearch from './locales/fr/search.json';
import enRoadmap from './locales/en/roadmap.json';
import frRoadmap from './locales/fr/roadmap.json';
import enCommunity from './locales/en/community.json';
import frCommunity from './locales/fr/community.json';
import enContributions from './locales/en/contributions.json';
import frContributions from './locales/fr/contributions.json';
import enCollections from './locales/en/collections.json';
import frCollections from './locales/fr/collections.json';
import enCommon from './locales/en/common.json';
import frCommon from './locales/fr/common.json';
import enFooter from './locales/en/footer.json';
import frFooter from './locales/fr/footer.json';
import enHero from './locales/en/hero.json';
import frHero from './locales/fr/hero.json';
import enCallToAction from './locales/en/callToAction.json';
import frCallToAction from './locales/fr/callToAction.json';
import enSections from './locales/en/sections.json';
import frSections from './locales/fr/sections.json';
import enFeatures from './locales/en/features.json';
import frFeatures from './locales/fr/features.json';
import enHowItWorks from './locales/en/howItWorks.json';
import frHowItWorks from './locales/fr/howItWorks.json';
import enQuickAccess from './locales/en/quickAccess.json';
import frQuickAccess from './locales/fr/quickAccess.json';
import enUploadTools from './locales/en/uploadTools.json';
import frUploadTools from './locales/fr/uploadTools.json';
import enTestimonials from './locales/en/testimonials.json';
import frTestimonials from './locales/fr/testimonials.json';
import enGamification from './locales/en/gamification.json';
import frGamification from './locales/fr/gamification.json';

const resources = {
  en: {
    translation: enTranslations,
    app: enApp,
    auth: enAuth,
    admin: enAdmin,
    header: enHeader,
    profile: enProfile,
    navigation: enNavigation,
    search: enSearch,
    roadmap: enRoadmap,
    community: enCommunity,
    contributions: enContributions,
    collections: enCollections,
    common: enCommon,
    footer: enFooter,
    hero: enHero,
    callToAction: enCallToAction,
    sections: enSections,
    features: enFeatures,
    howItWorks: enHowItWorks,
    quickAccess: enQuickAccess,
    uploadTools: enUploadTools,
    testimonials: enTestimonials,
    gamification: enGamification
  },
  fr: {
    translation: frTranslations,
    app: frApp,
    auth: frAuth,
    admin: frAdmin,
    header: frHeader,
    profile: frProfile,
    navigation: frNavigation,
    search: frSearch,
    roadmap: frRoadmap,
    community: frCommunity,
    contributions: frContributions,
    collections: frCollections,
    common: frCommon,
    footer: frFooter,
    hero: frHero,
    callToAction: frCallToAction,
    sections: frSections,
    features: frFeatures,
    howItWorks: frHowItWorks,
    quickAccess: frQuickAccess,
    uploadTools: frUploadTools,
    testimonials: frTestimonials,
    gamification: frGamification
  }
};

const LANGUAGE_STORAGE_KEY = 'app_language';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    lng: localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'fr',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    // Enhanced fallback configuration
    fallbackNS: 'translation',
    defaultNS: 'translation',
    
    // Return key if translation is missing
    returnEmptyString: false,
    returnNull: false,
    
    // Namespace separator
    nsSeparator: ':',
    keySeparator: '.'
  });

export default i18n;
