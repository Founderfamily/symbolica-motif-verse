
/**
 * Utilities for handling translations and validation
 */
import { ValidationReport, LegacyValidationReport, FormatIssue } from './types/validationTypes';
import { extractPlaceholders, findMissingKeys as findMissingKeysUtil } from './validators/validatorUtils';
import { findFormatIssues as findFormatIssuesImpl } from './validators/formatIssueValidator';
import en from './locales/en.json';
import fr from './locales/fr.json';

// Re-export the findMissingKeys function for external use
export const findMissingKeys = (source?: any, target?: any, prefix?: string) => {
  // If no parameters are provided, perform a default diagnosis
  if (!source && !target) {
    try {
      // Use imported translation files directly instead of require()
      const enTranslations = en;
      const frTranslations = fr;
      
      // Find keys missing in each language
      const missingInFr = findMissingKeysUtil(enTranslations, frTranslations);
      const missingInEn = findMissingKeysUtil(frTranslations, enTranslations);
      
      return {
        missingInFr,
        missingInEn,
        total: {
          en: countKeys(enTranslations),
          fr: countKeys(frTranslations)
        }
      };
    } catch (error) {
      console.error('Error performing translation diagnosis:', error);
      return { 
        missingInFr: [], 
        missingInEn: [],
        total: { en: 0, fr: 0 } 
      };
    }
  }
  
  // Use the utility function if parameters are provided
  return findMissingKeysUtil(source, target, prefix);
};

/**
 * Count the total number of keys in a nested object
 */
const countKeys = (obj: any, prefix = ''): number => {
  let count = 0;
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      // Count keys in nested objects
      count += countKeys(obj[key], fullKey);
    } else {
      count += 1;
    }
  }
  
  return count;
};

/**
 * Generate a diagnostic report for translations
 */
export const diagnoseTranslations = (): ValidationReport => {
  try {
    const missingKeysResult = findMissingKeys();
    const formatIssues: FormatIssue[] = findFormatIssues();
    
    // Type-safe access since we know missingKeysResult is not a string[]
    return {
      valid: missingKeysResult.missingInFr.length === 0 && missingKeysResult.missingInEn.length === 0 && formatIssues.length === 0,
      missingKeys: {
        en: missingKeysResult.missingInEn,
        fr: missingKeysResult.missingInFr
      },
      formatIssues,
      invalidKeyFormat: []
    };
  } catch (error) {
    console.error('Error diagnosing translations:', error);
    return {
      valid: false,
      missingKeys: { en: [], fr: [] },
      formatIssues: [],
      invalidKeyFormat: []
    };
  }
};

/**
 * Convert ValidationReport to LegacyValidationReport
 * This is necessary for backward compatibility
 */
export const convertToLegacyReport = (report: ValidationReport): LegacyValidationReport => {
  return {
    missingKeys: {
      missingInFr: report.missingKeys.fr,
      missingInEn: report.missingKeys.en,
      total: {
        en: report.missingKeys.en.length + report.missingKeys.fr.length,
        fr: report.missingKeys.fr.length + report.missingKeys.en.length
      }
    },
    formatIssues: report.formatIssues,
    summary: {
      missingCount: report.missingKeys.en.length + report.missingKeys.fr.length,
      formatIssuesCount: report.formatIssues.length
    }
  };
};

/**
 * Find format inconsistencies between translations
 */
export const findFormatIssues = (): FormatIssue[] => {
  try {
    // Use imported translation files directly
    const enTranslations = en;
    const frTranslations = fr;
    return findFormatIssuesImpl(enTranslations, frTranslations);
  } catch (error) {
    console.error('Error finding format issues:', error);
    return [];
  }
};

/**
 * Generate a fix report for translation issues
 */
export const generateFixReport = (report: ValidationReport) => {
  const fixes = {
    addMissingKeys: [...report.missingKeys.en, ...report.missingKeys.fr],
    fixFormatIssues: report.formatIssues.map(issue => issue.key)
  };
  
  return fixes;
};

/**
 * Check if a translation key exists in both English and French
 * Helps identify keys that need attention
 * 
 * @param key The translation key to check
 * @returns Whether the key exists in both languages
 */
export function keyExistsInBothLanguages(key: string): boolean {
  try {
    // Use imported translation files directly
    const enTranslations = en;
    const frTranslations = fr;
    
    // Helper to check nested keys
    const getNestedValue = (obj: any, path: string) => {
      return path.split('.').reduce((prev, curr) => {
        return prev && prev[curr] ? prev[curr] : undefined;
      }, obj);
    };
    
    return !!getNestedValue(enTranslations, key) && !!getNestedValue(frTranslations, key);
  } catch (e) {
    return false;
  }
}

/**
 * Validate that a translation key follows the format convention
 * Keys should be in dot notation format: section.subsection.element
 * 
 * @param key The translation key to validate
 * @returns Whether the key follows the format convention
 */
export function validateKeyFormat(key: string): boolean {
  // Basic check: at least one dot, no spaces, lowercase
  const validFormatRegex = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/;
  return validFormatRegex.test(key);
}

/**
 * Format a translation key as readable text
 * Used as fallback when a translation is missing
 * 
 * @param key The translation key to format
 * @returns A more human-readable version of the key
 */
export function formatKeyAsReadableText(key: string): string {
  try {
    // Get the last part of the key (after the last dot)
    const lastPart = key.split('.').pop() || '';
    
    // Replace camelCase with spaces and capitalize first letter
    const text = lastPart
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
    
    return text;
  } catch (e) {
    return key; // Return the original key if something goes wrong
  }
}

// Proper re-exports with correct names
export { findMissingKeysUtil };
export { findFormatIssuesImpl };

