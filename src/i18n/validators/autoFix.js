
/**
 * Auto-fix utilities for translations
 */

/**
 * Apply auto-fixes to missing translations
 */
const applyAutoFixes = (en, fr, missingInFr, missingInEn) => {
  const fixes = [];
  
  // Fix missing translations with placeholders
  missingInFr.forEach(key => {
    const enValue = getNestedValue(key, en);
    if (enValue === undefined) return;
    
    const placeholderValue = typeof enValue === 'string' 
      ? `[FR] ${enValue}` 
      : enValue;
    
    // Update the fr object (need to handle nested paths)
    setNestedValue(fr, key, placeholderValue);
    fixes.push({ key, action: 'Added missing French translation' });
  });
  
  missingInEn.forEach(key => {
    const frValue = getNestedValue(key, fr);
    if (frValue === undefined) return;
    
    const placeholderValue = typeof frValue === 'string' 
      ? `[EN] ${frValue}` 
      : frValue;
    
    // Update the en object
    setNestedValue(en, key, placeholderValue);
    fixes.push({ key, action: 'Added missing English translation' });
  });
  
  return fixes;
};

/**
 * Helper to get a nested value using a dot-notation path
 */
const getNestedValue = (path, obj) => {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === undefined || current === null) return undefined;
    current = current[part];
  }
  
  return current;
};

/**
 * Helper to set a nested value using a dot-notation path
 */
const setNestedValue = (obj, path, value) => {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
};

module.exports = {
  applyAutoFixes,
  getNestedValue,
  setNestedValue
};
