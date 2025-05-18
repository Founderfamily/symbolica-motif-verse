
import { FormatIssue } from '../types/validationTypes';
import { extractPlaceholders } from './validatorUtils';

/**
 * Find keys with format mismatches (e.g., different placeholders)
 */
export const findFormatIssues = (en: any, fr: any): FormatIssue[] => {
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
  
  compareObjects(en, fr);
  return issues;
};

/**
 * Generate a diagnostic report for translations
 * This functions is re-exported from translationUtils
 */
export const diagnoseTranslations = () => {
  // Placeholder for backward compatibility
  // The actual implementation is in translationUtils.ts
  return {};
};

/**
 * Generate a fix report for translation issues
 * This functions is re-exported from translationUtils
 */
export const generateFixReport = () => {
  // Placeholder for backward compatibility
  // The actual implementation is in translationUtils.ts
  return {};
};

// Make sure we only export the findFormatIssues function with the correct name
export { findFormatIssues as findFormatIssuesImpl };
