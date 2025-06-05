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

// Import remaining sections from original file
import frTranslationRemaining from './locales/fr.json';

// English translations - now importing existing files only
import enNavigation from './locales/en/navigation.json';
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enProfile from './locales/en/profile.json';
import enSections from './locales/en/sections.json';
import enSearchFilters from './locales/en/searchFilters.json';
import enTestimonials from './locales/en/testimonials.json';
import enRoadmap from './locales/en/roadmap.json';

const LANGUAGE_STORAGE_KEY = 'app_language';

// Merge all French translation files
const frTranslation = {
  app: frApp,
  hero: frHero,
  sections: frSections,
  features: frFeatures,
  quickAccess: frQuickAccess,
  callToAction: frCallToAction,
  howItWorks: frHowItWorks,
  uploadTools: frUploadTools,
  auth: frAuth,
  // Keep remaining translations from original file
  collections: frTranslationRemaining.collections,
  community: frTranslationRemaining.community,
  testimonials: frTranslationRemaining.testimonials,
  gamification: frTranslationRemaining.gamification,
  about: frTranslationRemaining.about,
  faq: frTranslationRemaining.faq,
  roadmap: frTranslationRemaining.roadmap,
  symbolTriptych: frTranslationRemaining.symbolTriptych,
  navigation: frTranslationRemaining.navigation,
  common: frTranslationRemaining.common,
  symbols: frTranslationRemaining.symbols,
  searchFilters: frTranslationRemaining.searchFilters
};

// Restructured English translations with proper hierarchy
const enTranslation = {
  // Create proper hierarchical structure from existing files
  navigation: enNavigation,
  common: enCommon,
  auth: enAuth,
  profile: enProfile,
  sections: enSections,
  searchFilters: enSearchFilters,
  testimonials: enTestimonials,
  roadmap: enRoadmap,
  
  // Add missing app section
  app: {
    name: "Symbolica",
    version: "1.0"
  },
  
  // Add missing hero section
  hero: {
    heading: "Explore the World's Symbolic Heritage",
    subheading: "Discover, analyze and contribute to the global symbolic heritage with our AI-powered platform",
    community: "Community",
    explore: "Explore"
  },
  
  // Add missing features section
  features: {
    tagline: "Advanced Features",
    title: "Powerful Tools for Symbol Analysis",
    mapping: {
      title: "Intelligent Mapping",
      description: "Map symbols across cultures and time periods"
    },
    identification: {
      title: "AI Identification",
      description: "Identify symbols using advanced AI technology"
    },
    documentation: {
      title: "Comprehensive Documentation",
      description: "Document and preserve symbolic heritage"
    }
  },
  
  // Add missing quickAccess section
  quickAccess: {
    title: "Quick Access",
    description: "Explore our main features",
    explore: "Explore",
    exploreSymbols: {
      title: "Explore Symbols",
      description: "Browse our extensive symbol database"
    },
    interactiveMap: {
      title: "Interactive Map",
      description: "Discover symbols on our world map"
    },
    thematicCollections: {
      title: "Thematic Collections",
      description: "Curated symbol collections by theme"
    },
    contribute: {
      title: "Contribute",
      description: "Share your symbolic discoveries"
    },
    community: {
      title: "Community",
      description: "Connect with fellow researchers"
    },
    trends: {
      title: "Trends",
      description: "Discover trending symbols and patterns"
    }
  },
  
  // Add missing callToAction section
  callToAction: {
    joinUs: "Join Our Community",
    description: "Become part of the global symbolic heritage preservation movement",
    join: "Join Now",
    explore: "Explore",
    support: "Support"
  },
  
  // Add missing howItWorks section
  howItWorks: {
    process: "Process",
    title: "How It Works",
    intro: "Discover how our platform helps preserve symbolic heritage",
    steps: {
      upload: {
        title: "Upload",
        desc: "Share your symbolic discoveries"
      },
      analyze: {
        title: "Analyze",
        desc: "Use AI to analyze and identify symbols"
      },
      document: {
        title: "Document",
        desc: "Add cultural context and meaning"
      },
      share: {
        title: "Share",
        desc: "Contribute to the global knowledge base"
      }
    }
  },
  
  // Add missing uploadTools section
  uploadTools: {
    title: "Upload Tools",
    subtitle: "Share your symbolic discoveries",
    capture: {
      title: "Capture",
      desc: "Take photos of symbols you discover"
    },
    analyze: {
      title: "Analyze",
      desc: "Use AI to analyze and identify"
    },
    share: {
      title: "Share",
      desc: "Add to the global database"
    },
    process: {
      title: "Analysis Process",
      subtitle: "How our AI analyzes symbols",
      original: "Original",
      detection: "Detection",
      extraction: "Extraction",
      classification: "Classification",
      result: "Result",
      example: "Example"
    }
  },
  
  // Keep other sections that may exist in the old structure
  collections: {
    title: "Collections",
    featured: "Featured Collections",
    explore: "Explore Collections"
  },
  
  community: {
    title: "Community",
    join: "Join Community",
    contributors: "Contributors"
  },
  
  gamification: {
    title: "Achievements",
    level: "Level",
    points: "Points"
  },
  
  about: {
    title: "About",
    mission: "Our Mission"
  },
  
  faq: {
    title: "FAQ",
    questions: "Frequently Asked Questions"
  },
  
  symbolTriptych: {
    title: "Symbol Gallery",
    explore: "Explore Symbols"
  },
  
  symbols: {
    title: "Symbols",
    search: "Search Symbols",
    filter: "Filter"
  }
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
