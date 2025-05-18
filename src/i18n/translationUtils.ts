
/**
 * Translation utility functions for validating and formatting keys
 */
import { i18n } from './config';

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
