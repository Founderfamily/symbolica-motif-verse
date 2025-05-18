
import { validateKeyFormat } from '../translationKeyConventions';

/**
 * Extract placeholders like {name} from a string
 */
export const extractPlaceholders = (text: string): string[] => {
  if (!text || typeof text !== 'string') return [];
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
};

/**
 * Find keys that don't follow the format conventions
 */
export const findInvalidFormatKeys = (translations: any, prefix = ''): string[] => {
  const invalidKeys: string[] = [];
  
  const checkKeys = (obj: any, currentPrefix = '') => {
    for (const key in obj) {
      const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Check nested objects
        checkKeys(obj[key], fullKey);
      } else if (!validateKeyFormat(fullKey)) {
        invalidKeys.push(fullKey);
      }
    }
  };
  
  checkKeys(translations);
  return invalidKeys;
};

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
