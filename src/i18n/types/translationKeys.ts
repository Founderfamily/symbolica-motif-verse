/**
 * Type definitions for translation keys
 * Ensures type safety for translation key usage
 */

export interface AppTranslations {
  version: string;
}

export interface HeroTranslations {
  heading: string;
  subheading: string;
  community: string;
  explore: string;
}

export interface SectionsTranslations {
  museumPortal: string;
  communityPortal: string;
  joinCommunity: string;
  partners: string;
  contactUs: string;
  community: string;
  roadmap: string;
  testimonials: string;
  newsletter: string;
  newsletterSub: string;
  subscribe: string;
  openSource: string;
  howItWorks: string;
}

export interface FeaturesTranslations {
  tagline: string;
  title: string;
  mapping: {
    title: string;
    description: string;
  };
  identification: {
    title: string;
    description: string;
  };
  documentation: {
    title: string;
    description: string;
  };
}

export interface QuickAccessTranslations {
  title: string;
  description: string;
  explore: string;
  exploreSymbols: {
    title: string;
    description: string;
  };
  interactiveMap: {
    title: string;
    description: string;
  };
  thematicCollections: {
    title: string;
    description: string;
  };
  contribute: {
    title: string;
    description: string;
  };
  community: {
    title: string;
    description: string;
  };
  trends: {
    title: string;
    description: string;
  };
}

export interface CallToActionTranslations {
  joinUs: string;
  description: string;
  join: string;
  explore: string;
  support: string;
}

export interface HowItWorksTranslations {
  process: string;
  title: string;
  intro: string;
  steps: {
    [key: string]: {
      title: string;
      desc: string;
    };
  };
}

export interface UploadToolsTranslations {
  title: string;
  subtitle: string;
  capture: {
    title: string;
    desc: string;
  };
  analyze: {
    title: string;
    desc: string;
  };
  share: {
    title: string;
    desc: string;
  };
  process: {
    title: string;
    subtitle: string;
    original: string;
    detection: string;
    extraction: string;
    classification: string;
    result: string;
    example: string;
  };
}

// Main translation schema
export interface TranslationSchema {
  app: AppTranslations;
  hero: HeroTranslations;
  sections: SectionsTranslations;
  features: FeaturesTranslations;
  quickAccess: QuickAccessTranslations;
  callToAction: CallToActionTranslations;
  howItWorks: HowItWorksTranslations;
  uploadTools: UploadToolsTranslations;
  // Keep references to other sections
  collections: any;
  community: any;
  testimonials: any;
  gamification: any;
  about: any;
  faq: any;
  roadmap: any;
  symbolTriptych: any;
  navigation: any;
  common: any;
  symbols: any;
  searchFilters: any;
}

// Type-safe translation key paths
export type TranslationKeyPaths = 
  | `app.${keyof AppTranslations}`
  | `hero.${keyof HeroTranslations}`
  | `sections.${keyof SectionsTranslations}`
  | `features.${keyof FeaturesTranslations}`
  | `features.mapping.${keyof FeaturesTranslations['mapping']}`
  | `features.identification.${keyof FeaturesTranslations['identification']}`
  | `features.documentation.${keyof FeaturesTranslations['documentation']}`
  | `quickAccess.${keyof QuickAccessTranslations}`
  | `quickAccess.exploreSymbols.${keyof QuickAccessTranslations['exploreSymbols']}`
  | `quickAccess.interactiveMap.${keyof QuickAccessTranslations['interactiveMap']}`
  | `quickAccess.thematicCollections.${keyof QuickAccessTranslations['thematicCollections']}`
  | `quickAccess.contribute.${keyof QuickAccessTranslations['contribute']}`
  | `quickAccess.community.${keyof QuickAccessTranslations['community']}`
  | `quickAccess.trends.${keyof QuickAccessTranslations['trends']}`
  | `callToAction.${keyof CallToActionTranslations}`
  | `howItWorks.${keyof HowItWorksTranslations}`
  | `uploadTools.${keyof UploadToolsTranslations}`
  | `uploadTools.capture.${keyof UploadToolsTranslations['capture']}`
  | `uploadTools.analyze.${keyof UploadToolsTranslations['analyze']}`
  | `uploadTools.share.${keyof UploadToolsTranslations['share']}`
  | `uploadTools.process.${keyof UploadToolsTranslations['process']}`
  | string; // Allow other keys for backward compatibility
