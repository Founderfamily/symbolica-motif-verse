
/**
 * Utilities for handling translations and validation
 */
import { ValidationReport, LegacyValidationReport, FormatIssue } from './types/validationTypes';
import { extractPlaceholders } from './validators/validatorUtils';
import en from './locales/en.json';
import fr from './locales/fr.json';

/**
 * Find keys that exist in source but not in target
 */
export const findMissingKeys = (source: any, target: any, prefix = ''): string[] => {
  const missingKeys: string[] = [];
  
  for (const key in source) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      // Recurse into nested objects
      if (!target[key] || typeof target[key] !== 'object') {
        missingKeys.push(fullKey);
      } else {
        missingKeys.push(...findMissingKeys(source[key], target[key], fullKey));
      }
    } else if (!target.hasOwnProperty(key)) {
      missingKeys.push(fullKey);
    }
  }
  
  return missingKeys;
};

/**
 * Run a full diagnosis of the translations
 */
export const diagnoseTranslations = () => {
  try {
    // Use imported translation files directly
    const enTranslations = en;
    const frTranslations = fr;
    
    // Find keys missing in each language
    const missingInFr = findMissingKeys(enTranslations, frTranslations);
    const missingInEn = findMissingKeys(frTranslations, enTranslations);
    
    // Create a simple validation report
    return {
      valid: missingInFr.length === 0 && missingInEn.length === 0,
      missingKeys: {
        en: missingInEn,
        fr: missingInFr
      },
      formatIssues: [],
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
 * Find format inconsistencies between translations
 */
export const findFormatIssues = (): FormatIssue[] => {
  try {
    // Use imported translation files directly
    const enTranslations = en;
    const frTranslations = fr;
    
    const issues: FormatIssue[] = [];
    const checkValue = (enValue: string, frValue: string, key: string) => {
      // Check for placeholder differences
      const enPlaceholders = extractPlaceholders(enValue);
      const frPlaceholders = extractPlaceholders(frValue);
      
      // Different number of placeholders
      if (enPlaceholders.length !== frPlaceholders.length) {
        issues.push({
          key,
          en: enValue,
          fr: frValue,
          issue: 'placeholderCount'
        });
        return;
      }
      
      // Different placeholder names
      const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
      const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
      if (missingInFr.length > 0 || missingInEn.length > 0) {
        issues.push({
          key,
          en: enValue,
          fr: frValue,
          issue: 'placeholderNames',
          details: {
            missingInFr,
            missingInEn
          }
        });
      }
    };
    
    const compareObjects = (enObj: any, frObj: any, currentPrefix = '') => {
      for (const key in enObj) {
        const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
        const enValue = enObj[key];
        const frValue = frObj?.[key];
        
        if (!frValue) continue; // Skip already reported missing keys
        
        if (typeof enValue === 'object' && enValue !== null && !Array.isArray(enValue)) {
          // Recurse into nested objects
          compareObjects(enValue, frValue, fullKey);
        } else if (typeof enValue === 'string' && typeof frValue === 'string') {
          // Compare string values
          checkValue(enValue, frValue, fullKey);
        }
      }
    };
    
    compareObjects(enTranslations, frTranslations);
    return issues;
  } catch (error) {
    console.error('Error finding format issues:', error);
    return [];
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
 */
export function validateKeyFormat(key: string): boolean {
  // Basic check: at least one dot, no spaces, lowercase
  const validFormatRegex = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/;
  return validFormatRegex.test(key);
}

/**
 * Format a translation key as readable text
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
