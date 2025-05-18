
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
