
/**
 * Utilities for handling translations and validation
 */
import { ValidationReport, FormatIssue } from './types/validationTypes';
import { findMissingKeys as findMissingKeysOriginal } from './validators/validatorUtils';
import { extractPlaceholders } from './validators/validatorUtils';

// Re-export the findMissingKeys function for external use
export const findMissingKeys = (source?: any, target?: any, prefix?: string) => {
  // If no parameters are provided, perform a default diagnosis
  if (!source && !target) {
    try {
      // Import translation files dynamically
      const enTranslations = require('./locales/en.json');
      const frTranslations = require('./locales/fr.json');
      
      // Find keys missing in each language
      const missingInFr = findMissingKeysOriginal(enTranslations, frTranslations);
      const missingInEn = findMissingKeysOriginal(frTranslations, enTranslations);
      
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
  
  // Use the original function if parameters are provided
  return findMissingKeysOriginal(source, target, prefix);
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
    const result = findMissingKeys();
    const formatIssues: FormatIssue[] = findFormatIssues();
    
    return {
      missingKeys: result,
      formatIssues,
      invalidKeyFormat: [],
      summary: {
        missingCount: result.missingInFr.length + result.missingInEn.length,
        formatIssuesCount: formatIssues.length,
        invalidKeyFormatCount: 0,
        isValid: result.missingInFr.length === 0 && result.missingInEn.length === 0 && formatIssues.length === 0
      }
    };
  } catch (error) {
    console.error('Error diagnosing translations:', error);
    return {
      missingKeys: { missingInFr: [], missingInEn: [], total: { en: 0, fr: 0 } },
      formatIssues: [],
      invalidKeyFormat: [],
      summary: {
        missingCount: 0,
        formatIssuesCount: 0,
        invalidKeyFormatCount: 0,
        isValid: false
      }
    };
  }
};

/**
 * Find format inconsistencies between translations
 */
export const findFormatIssues = (): FormatIssue[] => {
  try {
    const enTranslations = require('./locales/en.json');
    const frTranslations = require('./locales/fr.json');
    const issues: FormatIssue[] = [];
    
    // Helper function to check nested objects
    const checkFormat = (enObj: any, frObj: any, prefix = '') => {
      for (const key in enObj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof enObj[key] === 'object' && enObj[key] !== null && !Array.isArray(enObj[key])) {
          if (frObj[key] && typeof frObj[key] === 'object') {
            checkFormat(enObj[key], frObj[key], fullKey);
          }
        } else if (frObj[key] !== undefined) {
          // Check for placeholder consistency
          const enPlaceholders = extractPlaceholders(enObj[key]);
          const frPlaceholders = extractPlaceholders(frObj[key]);
          
          // Find placeholders in one language but not the other
          const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
          const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
          
          if (missingInFr.length > 0 || missingInEn.length > 0) {
            issues.push({
              key: fullKey,
              issue: `Placeholder mismatch: ${missingInFr.length > 0 ? `Missing in FR: ${missingInFr.join(', ')}` : ''}${missingInEn.length > 0 ? `Missing in EN: ${missingInEn.join(', ')}` : ''}`
            });
          }
        }
      }
    };
    
    checkFormat(enTranslations, frTranslations);
    return issues;
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
    addMissingKeys: [...report.missingKeys.missingInEn, ...report.missingKeys.missingInFr],
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
    // Dynamic import of translation files
    // This is a simplified check - in production, you'd want to use the i18n instance directly
    const enTranslations = require('./locales/en.json');
    const frTranslations = require('./locales/fr.json');
    
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
