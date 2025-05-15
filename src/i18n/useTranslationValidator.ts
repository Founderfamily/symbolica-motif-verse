
import { useEffect } from 'react';
import i18n from './config';
import en from './locales/en.json';
import fr from './locales/fr.json';

/**
 * A development tool to validate translation keys and detect missing translations.
 * This should be used in the root component of the app during development.
 */
export const useTranslationValidator = () => {
  useEffect(() => {
    // Only run in development environment
    if (process.env.NODE_ENV !== 'development') {
      return;
    }
    
    const validateTranslations = () => {
      // Check if all English keys exist in French translations
      const missingInFrench = findMissingKeys(en, fr, 'en');
      
      // Check if all French keys exist in English translations
      const missingInEnglish = findMissingKeys(fr, en, 'fr');
      
      // Log any issues found
      if (missingInFrench.length > 0 || missingInEnglish.length > 0) {
        console.warn('📝 Translation validation found issues:');
        
        if (missingInFrench.length > 0) {
          console.warn('⚠️ Missing French translations:', missingInFrench);
        }
        
        if (missingInEnglish.length > 0) {
          console.warn('⚠️ Missing English translations:', missingInEnglish);
        }
        
        console.warn('🔎 Please add the missing translation keys to maintain complete localization.');
      } else {
        console.info('✅ Translation validation passed: All keys are present in both languages.');
      }
    };
    
    validateTranslations();
  }, []);
};

/**
 * Recursively finds keys that exist in the source object but not in the target object
 */
const findMissingKeys = (
  source: Record<string, any>, 
  target: Record<string, any>, 
  sourceLanguage: string,
  prefix = ''
): string[] => {
  const missingKeys: string[] = [];
  
  Object.entries(source).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // If it's an object, recurse deeper
      if (target[key] === undefined) {
        missingKeys.push(`${fullKey} (entire section missing)`);
      } else if (typeof target[key] !== 'object') {
        missingKeys.push(`${fullKey} (expected object but found ${typeof target[key]})`);
      } else {
        missingKeys.push(...findMissingKeys(value, target[key], sourceLanguage, fullKey));
      }
    } else {
      // For primitive values, just check if the key exists
      if (target[key] === undefined) {
        missingKeys.push(`${fullKey}`);
      }
    }
  });
  
  return missingKeys;
};

/**
 * Use this hook to check if a specific key exists in both locales
 * @returns boolean indicating if the key exists in both locales
 */
export const validateTranslationKey = (key: string): boolean => {
  const keyExists = {
    en: keyExistsInObject(key, en),
    fr: keyExistsInObject(key, fr)
  };
  
  const isValid = keyExists.en && keyExists.fr;
  
  if (!isValid && process.env.NODE_ENV === 'development') {
    if (!keyExists.en) console.warn(`⚠️ Missing English translation for key: ${key}`);
    if (!keyExists.fr) console.warn(`⚠️ Missing French translation for key: ${key}`);
  }
  
  return isValid;
};

/**
 * Helper to check if a nested key exists in an object
 */
const keyExistsInObject = (path: string, obj: Record<string, any>): boolean => {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current[part] === undefined) {
      return false;
    }
    current = current[part];
  }
  
  return true;
};
