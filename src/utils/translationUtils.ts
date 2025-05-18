
/**
 * Utilities for handling translations from database content
 * These functions help display multilingual content from Supabase records
 */
import { i18n } from '@/i18n/config';

/**
 * Type representing an object with translations
 * Matches the structure of the 'translations' field in our database tables
 */
export type TranslatableObject = {
  translations?: Record<string, Record<string, any>> | null | any;
  [key: string]: any;
};

/**
 * Get a translated field value from an object based on the current language
 * Falls back to specified language if translation doesn't exist
 * 
 * @param obj The object containing translations or direct field values
 * @param field The name of the field to translate
 * @param fallbackLang The fallback language code (defaults to 'en')
 * @param showWarnings Whether to show console warnings for missing translations in dev mode
 * @returns The translated value or fallback
 */
export const getTranslatedField = <T>(
  obj: TranslatableObject | null | undefined,
  field: string,
  fallbackLang = 'en',
  showWarnings = process.env.NODE_ENV === 'development'
): T | string => {
  if (!obj) return '';
  
  const currentLang = i18n.language || 'fr';
  
  // Check if the object has translations
  if (obj.translations && typeof obj.translations === 'object') {
    // Try current language
    if (obj.translations[currentLang]?.[field] !== undefined) {
      return obj.translations[currentLang][field];
    }
    
    // Try fallback language
    if (obj.translations[fallbackLang]?.[field] !== undefined) {
      if (showWarnings) {
        console.warn(
          `Translation missing for "${field}" in "${currentLang}", using "${fallbackLang}" instead`,
          obj
        );
      }
      return obj.translations[fallbackLang][field];
    }
  }
  
  // Fallback to direct field on the object
  if (obj[field] !== undefined) {
    if (showWarnings && obj.translations) {
      console.warn(
        `No translation found for "${field}" in any language, using direct field value`,
        obj
      );
    }
    return obj[field];
  }
  
  // Return empty string if nothing found
  if (showWarnings) {
    console.warn(`No value found for "${field}" in object:`, obj);
  }
  return '';
};

/**
 * Get a translated array field from an object based on current language
 * Useful for arrays like 'medium', 'technique', etc.
 * 
 * @param obj The object containing translations or direct field values
 * @param field The name of the array field to translate
 * @param fallbackLang The fallback language code (defaults to 'en')
 * @returns The translated array or empty array
 */
export const getTranslatedArray = (
  obj: TranslatableObject | null | undefined,
  field: string,
  fallbackLang = 'en'
): string[] => {
  if (!obj) return [];
  
  const currentLang = i18n.language || 'fr';
  
  // Check if the object has translations
  if (obj.translations && typeof obj.translations === 'object') {
    // Try current language
    if (Array.isArray(obj.translations[currentLang]?.[field])) {
      return obj.translations[currentLang][field];
    }
    
    // Try fallback language
    if (Array.isArray(obj.translations[fallbackLang]?.[field])) {
      return obj.translations[fallbackLang][field];
    }
  }
  
  // Return the original array if it exists
  if (Array.isArray(obj[field])) {
    return obj[field];
  }
  
  return [];
};

/**
 * Check if a translation exists for a specific field and language
 * 
 * @param obj The object potentially containing translations
 * @param lang The language code to check
 * @param field The field name to check
 * @returns Boolean indicating if translation exists
 */
export const hasTranslation = (
  obj: TranslatableObject | null | undefined,
  lang: string,
  field: string
): boolean => {
  if (!obj?.translations) return false;
  
  return (
    typeof obj.translations === 'object' &&
    obj.translations !== null &&
    typeof obj.translations[lang] === 'object' &&
    obj.translations[lang] !== null &&
    obj.translations[lang][field] !== undefined &&
    obj.translations[lang][field] !== null
  );
};

/**
 * Get the appropriate language code for an object
 * Checks if the current language is available, otherwise returns fallback
 * 
 * @param obj The object containing translations
 * @param fallbackLang The fallback language code (defaults to 'en')
 * @returns The best language code to use
 */
export const getBestLanguage = (
  obj: TranslatableObject | null | undefined,
  fallbackLang = 'en'
): string => {
  if (!obj?.translations) return fallbackLang;
  
  const currentLang = i18n.language || 'fr';
  
  if (obj.translations[currentLang]) return currentLang;
  if (obj.translations[fallbackLang]) return fallbackLang;
  
  // Return the first available language if neither current nor fallback exists
  const languages = Object.keys(obj.translations);
  return languages.length > 0 ? languages[0] : fallbackLang;
};

/**
 * Check if an object has any translations
 * Useful for determining if the object uses the translation system
 */
export const hasAnyTranslations = (
  obj: TranslatableObject | null | undefined
): boolean => {
  return !!(
    obj?.translations &&
    typeof obj.translations === 'object' &&
    Object.keys(obj.translations).length > 0
  );
};
