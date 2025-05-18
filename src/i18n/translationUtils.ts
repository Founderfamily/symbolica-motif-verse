
import { i18n } from '@/i18n/config';

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
