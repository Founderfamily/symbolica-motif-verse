
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
import enHowItWorks from './locales/en/howItWorks.json';
import frHowItWorks from './locales/fr/howItWorks.json';
import enUploadTools from './locales/en/uploadTools.json';
import frUploadTools from './locales/fr/uploadTools.json';
import enTestimonials from './locales/en/testimonials.json';
import frTestimonials from './locales/fr/testimonials.json';
import enSections from './locales/en/sections.json';
import frSections from './locales/fr/sections.json';

const resources = {
  en: {
    translation: {
      ...enTranslations,
      ...enHero.hero,
      ...enFeatures.features,
      ...enCallToAction.callToAction,
      ...enGamification.gamification,
      ...enHowItWorks.howItWorks,
      ...enUploadTools.uploadTools,
      ...enTestimonials,
      ...enSections.sections
    },
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
    gamification: enGamification,
    howItWorks: enHowItWorks,
    uploadTools: enUploadTools,
    testimonials: enTestimonials,
    sections: enSections
  },
  fr: {
    translation: {
      ...frTranslations,
      ...frHero.hero,
      ...frFeatures.features,
      ...frCallToAction.callToAction,
      ...frGamification.gamification,
      ...frHowItWorks.howItWorks,
      ...frUploadTools.uploadTools,
      ...frTestimonials,
      ...frSections.sections
    },
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
    gamification: frGamification,
    howItWorks: frHowItWorks,
    uploadTools: frUploadTools,
    testimonials: frTestimonials,
    sections: frSections
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
    ns: ['translation', 'app', 'auth', 'admin', 'header', 'profile', 'navigation', 'search', 'roadmap', 'community', 'contributions', 'hero', 'features', 'callToAction', 'gamification', 'howItWorks', 'uploadTools', 'testimonials', 'sections']
  });

export default i18n;
