import { i18n } from '@/i18n/config';
import en from './locales/en.json';
import fr from './locales/fr.json';
import { FormatIssue, ValidationReport } from './types/validationTypes';

/**
 * Format a translation key as a readable text
 * For example: "common.button.submit" -> "Submit"
 */
export const formatKeyAsReadableText = (key: string): string => {
  // Get the last part of the key (after the last dot)
  const lastPart = key.split('.').pop() || key;
  
  // Convert camelCase to space-separated words
  return lastPart
    .replace(/([A-Z])/g, ' $1') // Insert a space before capitals
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim(); // Remove leading/trailing whitespace
};

/**
 * Check if a key exists in both language files
 */
export const keyExistsInBothLanguages = (key: string): boolean => {
  if (!key) return false;
  
  return (
    i18n.exists(key, { lng: 'en' }) &&
    i18n.exists(key, { lng: 'fr' })
  );
};

/**
 * Check if a key has the same value in both languages (potential untranslated content)
 */
export const hasSameValueInBothLanguages = (key: string): boolean => {
  if (!keyExistsInBothLanguages(key)) return false;
  
  const enValue = i18n.t(key, { lng: 'en' });
  const frValue = i18n.t(key, { lng: 'fr' });
  
  return enValue === frValue && enValue !== '';
};

/**
 * Validate key format according to conventions
 * Format should be: namespace.section.identifier
 */
export const validateKeyFormat = (key: string): boolean => {
  if (!key) return false;
  
  // Split the key into parts
  const parts = key.split('.');
  
  // Check if it has at least 2 parts (namespace.identifier)
  if (parts.length < 2) return false;
  
  // Check if all parts follow naming conventions (lowercase, no special chars except hyphens)
  const validParts = parts.every(part => /^[a-z0-9-]+$/.test(part));
  
  return validParts;
};

/**
 * Find missing translation keys between languages
 */
export const findMissingKeys = () => {
  // Load translations directly
  const enTranslations = en;
  const frTranslations = fr;
  
  const missingInFr: string[] = [];
  const missingInEn: string[] = [];
  
  // Helper function to recursively check keys
  const checkKeys = (obj1: any, obj2: any, parentKey = '') => {
    for (const key in obj1) {
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      
      if (typeof obj1[key] === 'object' && obj1[key] !== null && !Array.isArray(obj1[key])) {
        // If it's an object, check if the corresponding path exists in obj2
        if (!obj2[key] || typeof obj2[key] !== 'object') {
          // If the path doesn't exist in obj2 or is not an object, mark all nested keys as missing
          const collectNestedKeys = (nestedObj: any, nestedParentKey: string) => {
            for (const nestedKey in nestedObj) {
              const fullNestedKey = `${nestedParentKey}.${nestedKey}`;
              if (typeof nestedObj[nestedKey] === 'object' && nestedObj[nestedKey] !== null && !Array.isArray(nestedObj[nestedKey])) {
                collectNestedKeys(nestedObj[nestedKey], fullNestedKey);
              } else {
                if (obj1 === enTranslations) {
                  missingInFr.push(fullNestedKey);
                } else {
                  missingInEn.push(fullNestedKey);
                }
              }
            }
          };
          collectNestedKeys(obj1[key], currentKey);
        } else {
          // If the path exists, recurse into it
          checkKeys(obj1[key], obj2[key], currentKey);
        }
      } else if (!obj2.hasOwnProperty(key)) {
        // If it's a leaf node and doesn't exist in obj2
        if (obj1 === enTranslations) {
          missingInFr.push(currentKey);
        } else {
          missingInEn.push(currentKey);
        }
      }
    }
  };
  
  // Check both ways
  checkKeys(enTranslations, frTranslations);
  checkKeys(frTranslations, enTranslations);
  
  return {
    missingInFr,
    missingInEn,
    total: {
      en: countKeys(enTranslations),
      fr: countKeys(frTranslations)
    }
  };
};

// Helper to count total number of keys in a nested object
const countKeys = (obj: any): number => {
  let count = 0;
  
  const traverse = (o: any) => {
    for (const key in o) {
      if (typeof o[key] === 'object' && o[key] !== null && !Array.isArray(o[key])) {
        traverse(o[key]);
      } else {
        count++;
      }
    }
  };
  
  traverse(obj);
  return count;
};

/**
 * Diagnose translation issues including missing keys and format problems
 */
export const diagnoseTranslations = (): ValidationReport => {
  const missingKeys = findMissingKeys();
  const formatIssues = findFormatIssues();
  
  return {
    missingKeys,
    formatIssues,
    summary: {
      missingCount: missingKeys.missingInEn.length + missingKeys.missingInFr.length,
      formatIssuesCount: formatIssues.length,
    }
  };
};

/**
 * Find format issues in translations like mismatched placeholders
 */
const findFormatIssues = (): FormatIssue[] => {
  const issues: FormatIssue[] = [];
  
  // Get all keys that exist in both languages
  const allKeys = new Set<string>();
  
  const findAllKeys = (obj: any, path = '') => {
    for (const key in obj) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        findAllKeys(obj[key], currentPath);
      } else {
        allKeys.add(currentPath);
      }
    }
  };
  
  findAllKeys(en);
  
  // Check each key for format issues
  for (const key of allKeys) {
    // Skip keys that don't exist in both languages
    if (!keyExistsInBothLanguages(key)) continue;
    
    const enValue = getNestedValue(en, key);
    const frValue = getNestedValue(fr, key);
    
    if (typeof enValue !== 'string' || typeof frValue !== 'string') continue;
    
    // Check for placeholder differences
    const enPlaceholders = extractPlaceholders(enValue);
    const frPlaceholders = extractPlaceholders(frValue);
    
    // Different number of placeholders
    if (enPlaceholders.length !== frPlaceholders.length) {
      issues.push({
        key,
        enValue,
        frValue,
        issue: 'Different number of placeholders'
      });
      continue;
    }
    
    // Different placeholder names
    const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
    const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
    
    if (missingInFr.length > 0 || missingInEn.length > 0) {
      issues.push({
        key,
        enValue,
        frValue,
        issue: 'Mismatched placeholder names'
      });
    }
  }
  
  return issues;
};

/**
 * Extract placeholders from a string like {name} or {count}
 */
const extractPlaceholders = (text: string): string[] => {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
};

/**
 * Get a nested value from an object using a dot notation path
 */
const getNestedValue = (obj: any, path: string): any => {
  const keys = path.split('.');
  return keys.reduce((o, key) => (o && o[key] !== undefined) ? o[key] : undefined, obj);
};

/**
 * Generate a report for fixing translation issues
 */
export const generateFixReport = () => {
  const diagnosis = diagnoseTranslations();
  
  return {
    summary: diagnosis.summary,
    missingKeys: {
      french: diagnosis.missingKeys.missingInFr,
      english: diagnosis.missingKeys.missingInEn
    },
    formatIssues: diagnosis.formatIssues,
    suggestedFixes: {
      french: diagnosis.missingKeys.missingInFr.map(key => {
        const enValue = getNestedValue(en, key);
        return { key, suggestedValue: enValue };
      }),
      english: diagnosis.missingKeys.missingInEn.map(key => {
        const frValue = getNestedValue(fr, key);
        return { key, suggestedValue: frValue };
      })
    }
  };
};
