
/**
 * Comprehensive utilities for translation management
 */
import fr from './locales/fr.json';
import en from './locales/en.json';

/**
 * Flattens a nested object structure into a single level object with dot notation keys
 */
export const flattenObject = (obj: any, prefix = ''): Record<string, string> => {
  return Object.keys(obj).reduce((acc: Record<string, string>, key) => {
    const pre = prefix.length ? `${prefix}.` : '';
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
    } else {
      acc[`${pre}${key}`] = obj[key];
    }
    
    return acc;
  }, {});
};

/**
 * Finds missing translation keys between languages
 */
export const findMissingKeys = () => {
  const flatEn = flattenObject(en);
  const flatFr = flattenObject(fr);
  
  const missingInFr = Object.keys(flatEn).filter(key => !flatFr[key]);
  const missingInEn = Object.keys(flatFr).filter(key => !flatEn[key]);
  
  return {
    missingInFr,
    missingInEn,
    total: {
      en: Object.keys(flatEn).length,
      fr: Object.keys(flatFr).length
    }
  };
};

/**
 * Checks if a key exists in both languages
 */
export const keyExistsInBothLanguages = (key: string): boolean => {
  const flatEn = flattenObject(en);
  const flatFr = flattenObject(fr);
  
  return flatEn[key] !== undefined && flatFr[key] !== undefined;
};

/**
 * Extract placeholders like {name} from a string
 */
export const extractPlaceholders = (text: string): string[] => {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches : [];
};

/**
 * Validates a translation key for format issues between languages
 */
export const validateTranslationFormat = (key: string): { valid: boolean; issue?: string } => {
  const flatEn = flattenObject(en);
  const flatFr = flattenObject(fr);
  
  if (!flatEn[key] || !flatFr[key]) {
    return { valid: false, issue: 'missing' };
  }
  
  const enPlaceholders = extractPlaceholders(flatEn[key]);
  const frPlaceholders = extractPlaceholders(flatFr[key]);
  
  // Check if both languages have the same placeholders
  const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
  const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
  
  if (missingInFr.length > 0 || missingInEn.length > 0) {
    return { 
      valid: false, 
      issue: 'placeholders',
    };
  }
  
  return { valid: true };
};

/**
 * Gets the translated value for a key in a specific language
 */
export const getTranslationValue = (key: string, lang: string = 'fr'): string | undefined => {
  const translations = lang === 'fr' ? fr : en;
  const flatTranslations = flattenObject(translations);
  return flatTranslations[key];
};

/**
 * Run a quick diagnostic of the translation system
 */
export const diagnoseTranslations = () => {
  const missingKeys = findMissingKeys();
  const formatIssues: { key: string; issue: string }[] = [];
  
  // Check for format issues in keys that exist in both languages
  const flatEn = flattenObject(en);
  
  Object.keys(flatEn).forEach(key => {
    if (flattenObject(fr)[key]) {
      const validation = validateTranslationFormat(key);
      if (!validation.valid && validation.issue) {
        formatIssues.push({ key, issue: validation.issue });
      }
    }
  });
  
  return {
    missingKeys,
    formatIssues,
    summary: {
      totalKeys: missingKeys.total.en + missingKeys.total.fr,
      missingCount: missingKeys.missingInEn.length + missingKeys.missingInFr.length,
      formatIssuesCount: formatIssues.length
    }
  };
};

/**
 * Generates a fix report for translation issues
 */
export const generateFixReport = () => {
  const diagnosis = diagnoseTranslations();
  const report = {
    timestamp: new Date().toISOString(),
    issues: diagnosis.summary.missingCount + diagnosis.summary.formatIssuesCount,
    details: {
      missing: {
        inFrench: diagnosis.missingKeys.missingInFr.length,
        inEnglish: diagnosis.missingKeys.missingInEn.length,
      },
      format: diagnosis.formatIssues.length
    },
    fixes: [] as string[]
  };
  
  return report;
};

/**
 * Validates that a translation key follows the established format
 */
export const validateKeyFormat = (key: string): boolean => {
  // Keys should follow: namespace.section.element[.qualifier]
  const keyPattern = /^[a-z0-9]+(\.[a-z0-9]+){1,4}$/;
  return keyPattern.test(key);
};
