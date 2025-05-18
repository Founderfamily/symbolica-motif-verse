
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
