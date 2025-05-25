
/**
 * Translation utilities
 * Shared utilities for working with translations
 */
import i18n from './config';

// Get flattened translations for the current language
export const getFlattenedTranslations = (lng?: string) => {
  const language = lng || i18n.language;
  const translations = i18n.getResourceBundle(language, 'translation');
  return flattenObject(translations);
};

// Flatten nested object into dot notation keys
export const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    
    return acc;
  }, {});
};

// Get all translation keys for a language
export const getAllKeys = (lng?: string): string[] => {
  const flattened = getFlattenedTranslations(lng);
  return Object.keys(flattened);
};

// Check if a translation key exists
export const hasTranslationKey = (key: string, lng?: string): boolean => {
  const language = lng || i18n.language;
  return i18n.exists(key, { lng: language });
};

// Diagnose translation issues
export const diagnoseTranslations = () => {
  const enTranslations = getFlattenedTranslations('en');
  const frTranslations = getFlattenedTranslations('fr');
  
  const enKeys = Object.keys(enTranslations);
  const frKeys = Object.keys(frTranslations);
  
  const missingInFr = enKeys.filter(key => !frKeys.includes(key));
  const missingInEn = frKeys.filter(key => !enKeys.includes(key));
  
  // Check for format issues
  const formatIssues: Array<{ key: string; issue: string }> = [];
  
  enKeys.forEach(key => {
    if (frTranslations[key]) {
      const enValue = enTranslations[key];
      const frValue = frTranslations[key];
      
      // Check for placeholder consistency
      const enPlaceholders = (enValue.match(/\{[^}]+\}/g) || []);
      const frPlaceholders = (frValue.match(/\{[^}]+\}/g) || []);
      
      if (enPlaceholders.length !== frPlaceholders.length) {
        formatIssues.push({
          key,
          issue: `Placeholder mismatch: EN has ${enPlaceholders.length}, FR has ${frPlaceholders.length}`
        });
      }
    }
  });
  
  return {
    missingKeys: {
      total: { en: enKeys.length, fr: frKeys.length },
      missingInFr,
      missingInEn
    },
    formatIssues,
    summary: {
      missingCount: missingInFr.length + missingInEn.length,
      formatIssuesCount: formatIssues.length
    }
  };
};

// Generate fix report
export const generateFixReport = () => {
  const diagnosis = diagnoseTranslations();
  return {
    ...diagnosis,
    recommendations: [
      'Add missing translations to both language files',
      'Fix format inconsistencies',
      'Run validator again to verify fixes'
    ]
  };
};
