
/**
 * Utilities for validating translation key conventions
 */

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
    return lastPart
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
  } catch (e) {
    return key; // Return the original key if something goes wrong
  }
}
