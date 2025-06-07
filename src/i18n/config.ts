
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import main translation files
import enTranslations from './locales/en/app.json';
import frTranslations from './locales/fr/app.json';

// Import namespace-specific translations
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

// Import homepage sections
import enHero from './locales/en/hero.json';
import frHero from './locales/fr/hero.json';
import enFeatures from './locales/en/features.json';
import frFeatures from './locales/fr/features.json';
import enCallToAction from './locales/en/callToAction.json';
import frCallToAction from './locales/fr/callToAction.json';
import enGamification from './locales/en/gamification.json';
import frGamification from './locales/fr/gamification.json';

const resources = {
  en: {
    translation: enTranslations,
    app: enTranslations,
    auth: enAuth,
    admin: enAdmin,
    header: enHeader,
    profile: enProfile,
    navigation: enNavigation,
    search: enSearch,
    roadmap: enRoadmap,
    community: enCommunity,
    contributions: enContributions,
    hero: enHero,
    features: enFeatures,
    callToAction: enCallToAction,
    gamification: enGamification
  },
  fr: {
    translation: frTranslations,
    app: frTranslations,
    auth: frAuth,
    admin: frAdmin,
    header: frHeader,
    profile: frProfile,
    navigation: frNavigation,
    search: frSearch,
    roadmap: frRoadmap,
    community: frCommunity,
    contributions: frContributions,
    hero: frHero,
    features: frFeatures,
    callToAction: frCallToAction,
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
    
    // Add default namespace
    defaultNS: 'translation',
    ns: ['translation', 'app', 'auth', 'admin', 'header', 'profile', 'navigation', 'search', 'roadmap', 'community', 'contributions', 'hero', 'features', 'callToAction', 'gamification']
  });

export default i18n;
