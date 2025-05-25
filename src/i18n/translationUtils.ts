
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
