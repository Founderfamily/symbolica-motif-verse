
/**
 * Translation loading and data transformation utilities
 */

const fs = require('fs');
const path = require('path');

/**
 * Load translation files
 */
const loadTranslations = (localesDir) => {
  try {
    const enPath = path.join(localesDir, 'en.json');
    const frPath = path.join(localesDir, 'fr.json');
    
    if (!fs.existsSync(enPath) || !fs.existsSync(frPath)) {
      console.error('❌ Translation files not found. Expected at:');
      console.error(`   - ${enPath}`);
      console.error(`   - ${frPath}`);
      return null;
    }
    
    const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const fr = JSON.parse(fs.readFileSync(frPath, 'utf8'));
    
    return { en, fr };
  } catch (error) {
    console.error('❌ Error loading translation files:', error.message);
    return null;
  }
};

/**
 * Flatten the nested structure of a translation file
 */
const flattenTranslations = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenTranslations(obj[key], prefixedKey));
    } else {
      acc[prefixedKey] = obj[key];
    }
    
    return acc;
  }, {});
};

module.exports = {
  loadTranslations,
  flattenTranslations
};
