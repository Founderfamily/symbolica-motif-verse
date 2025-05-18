
/**
 * Translation utility functions for validating and formatting keys
 */
import { i18n } from './config';
import fs from 'fs';
import path from 'path';

/**
 * Validates if a translation key follows the proper format convention
 * Format: namespace.section.key (e.g., "common.buttons.save")
 */
export const validateKeyFormat = (key: string): boolean => {
  // Regex for checking format: namespace.section.key
  // Allows alphanumeric characters, hyphens, and underscores for each segment
  const keyPattern = /^[a-z0-9-_]+\.[a-z0-9-_]+\.[a-z0-9-_.]+$/i;
  return keyPattern.test(key);
};

/**
 * Formats a translation key into readable text
 * Used as fallback when a translation is missing
 */
export const formatKeyAsReadableText = (key: string): string => {
  // Get the last part of the key (after the last dot)
  const lastPart = key.split('.').pop() || key;
  
  // Convert camelCase to spaces
  return lastPart
    // Insert a space before uppercase letters that follow lowercase
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace hyphens and underscores with spaces
    .replace(/[-_]/g, ' ')
    // Capitalize the first letter of each word
    .replace(/\b\w/g, c => c.toUpperCase());
};

/**
 * Check if a translation key exists in both languages
 */
export const keyExistsInBothLanguages = (key: string): boolean => {
  const existsInEn = i18n.exists(key, { lng: 'en' });
  const existsInFr = i18n.exists(key, { lng: 'fr' });
  
  return existsInEn && existsInFr;
};

/**
 * Type for translation diagnosis results
 */
interface TranslationDiagnosis {
  missingKeys: {
    missingInEn: string[];
    missingInFr: string[];
    total: {
      en: number;
      fr: number;
    };
  };
  formatIssues: Array<{
    key: string;
    issue: string;
    details?: {
      missingInEn?: string[];
      missingInFr?: string[];
    };
  }>;
  summary: {
    missingCount: number;
    formatIssuesCount: number;
  };
}

/**
 * Type for the translation report
 */
interface TranslationReport {
  timestamp: string;
  results: TranslationDiagnosis;
  recommendations: string[];
}

/**
 * Find all the translation keys in the codebase and check which ones are missing
 */
export const findMissingKeys = (): { missingInEn: string[], missingInFr: string[], total: { en: number, fr: number } } => {
  try {
    // Load translation files
    const enPath = path.resolve(__dirname, 'locales/en.json');
    const frPath = path.resolve(__dirname, 'locales/fr.json');
    
    const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const frTranslations = JSON.parse(fs.readFileSync(frPath, 'utf8'));
    
    // Helper function to flatten nested translation objects
    const flattenTranslations = (obj: any, prefix = ''): string[] => {
      return Object.keys(obj).reduce((acc: string[], key) => {
        const prefixedKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          return [...acc, ...flattenTranslations(obj[key], prefixedKey)];
        }
        return [...acc, prefixedKey];
      }, []);
    };
    
    // Get all keys from both translation files
    const enKeys = flattenTranslations(enTranslations);
    const frKeys = flattenTranslations(frTranslations);
    
    // Find keys in en that are not in fr
    const missingInFr = enKeys.filter(key => !frKeys.includes(key));
    
    // Find keys in fr that are not in en
    const missingInEn = frKeys.filter(key => !enKeys.includes(key));
    
    return {
      missingInEn,
      missingInFr,
      total: {
        en: enKeys.length,
        fr: frKeys.length
      }
    };
  } catch (error) {
    console.error('Error finding missing keys:', error);
    return {
      missingInEn: [],
      missingInFr: [],
      total: { en: 0, fr: 0 }
    };
  }
};

/**
 * Extract placeholders from translation strings
 */
const extractPlaceholders = (text: string): string[] => {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
};

/**
 * Diagnose translation issues including missing keys and format inconsistencies
 */
export const diagnoseTranslations = (): TranslationDiagnosis => {
  // Find missing keys
  const missingKeys = findMissingKeys();
  
  // Format issues checking
  const formatIssues: Array<{
    key: string;
    issue: string;
    details?: {
      missingInEn?: string[];
      missingInFr?: string[];
    };
  }> = [];
  
  try {
    const enPath = path.resolve(__dirname, 'locales/en.json');
    const frPath = path.resolve(__dirname, 'locales/fr.json');
    
    const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const frTranslations = JSON.parse(fs.readFileSync(frPath, 'utf8'));
    
    const checkFormatIssues = (enObj: any, frObj: any, prefix = '') => {
      for (const key in enObj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        const enValue = enObj[key];
        const frValue = frObj?.[key];
        
        if (!frValue) continue; // Skip missing keys
        
        if (typeof enValue === 'object' && enValue !== null && !Array.isArray(enValue)) {
          // Recurse into nested objects
          if (typeof frValue === 'object' && frValue !== null && !Array.isArray(frValue)) {
            checkFormatIssues(enValue, frValue, fullKey);
          }
        } else if (typeof enValue === 'string' && typeof frValue === 'string') {
          // Check for placeholder differences
          const enPlaceholders = extractPlaceholders(enValue);
          const frPlaceholders = extractPlaceholders(frValue);
          
          // Different number of placeholders
          if (enPlaceholders.length !== frPlaceholders.length) {
            formatIssues.push({
              key: fullKey,
              issue: 'Different number of placeholders'
            });
            continue;
          }
          
          // Different placeholder names
          const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
          const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
          
          if (missingInFr.length > 0 || missingInEn.length > 0) {
            formatIssues.push({
              key: fullKey,
              issue: 'Inconsistent placeholder names',
              details: {
                missingInFr: missingInFr.length > 0 ? missingInFr : undefined,
                missingInEn: missingInEn.length > 0 ? missingInEn : undefined
              }
            });
          }
        }
      }
    };
    
    // Check format issues in both directions
    checkFormatIssues(enTranslations, frTranslations);
  } catch (error) {
    console.error('Error checking format issues:', error);
  }
  
  // Calculate summary
  const missingCount = missingKeys.missingInEn.length + missingKeys.missingInFr.length;
  
  return {
    missingKeys,
    formatIssues,
    summary: {
      missingCount,
      formatIssuesCount: formatIssues.length
    }
  };
};

/**
 * Generate a report for fixing translation issues
 */
export const generateFixReport = (diagnosis: TranslationDiagnosis): TranslationReport => {
  const recommendations: string[] = [];
  
  // Add recommendations based on diagnosis
  if (diagnosis.missingKeys.missingInEn.length > 0 || diagnosis.missingKeys.missingInFr.length > 0) {
    recommendations.push('Add missing translations to both language files');
    recommendations.push('Run the i18n-generate-missing.js script to automatically add placeholders for missing keys');
  }
  
  if (diagnosis.formatIssues.length > 0) {
    recommendations.push('Fix format inconsistencies in translations, especially placeholder names');
    recommendations.push('Use the validateTranslations.js script to check for format issues regularly');
  }
  
  return {
    timestamp: new Date().toISOString(),
    results: diagnosis,
    recommendations
  };
};

/**
 * Utilities for handling translations from database content
 * These functions help display multilingual content from Supabase records
 */

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
