
/**
 * Object manipulation utilities for translation generators
 */

/**
 * Generate nested object from dot notation keys
 */
const buildNestedObject = (keys) => {
  const result = {};
  
  keys.forEach(key => {
    const parts = key.split('.');
    let current = result;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // Last part, set the value
        current[part] = current[part] || null;
      } else {
        // Create nested object if needed
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  });
  
  return result;
};

/**
 * Deep merge two objects
 */
const deepMerge = (target, source) => {
  const output = Object.assign({}, target);
  
  if (typeof target !== 'object' || target === null) {
    return source;
  }
  
  if (typeof source !== 'object' || source === null) {
    return output;
  }
  
  Object.keys(source).forEach(key => {
    const targetValue = output[key];
    const sourceValue = source[key];
    
    if (
      Array.isArray(targetValue) && Array.isArray(sourceValue)
    ) {
      output[key] = [...targetValue, ...sourceValue.filter(item => !targetValue.includes(item))];
    } else if (
      typeof targetValue === 'object' && targetValue !== null &&
      typeof sourceValue === 'object' && sourceValue !== null
    ) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else if (output[key] === undefined) {
      output[key] = sourceValue;
    }
  });
  
  return output;
};

/**
 * Add missing translation placeholders
 */
const addMissingTranslations = (translationObj, keys, lang) => {
  const missingKeys = [];
  const nestedObj = buildNestedObject(keys);
  
  // Helper function to process nested objects
  const processNested = (target, source, prefix = '') => {
    Object.keys(source).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof source[key] === 'object' && source[key] !== null) {
        // Create object if it doesn't exist
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {};
        }
        
        // Process nested object
        processNested(target[key], source[key], fullKey);
      } else if (target[key] === undefined) {
        // Add placeholder for missing leaf node
        target[key] = `[TODO ${lang}] ${fullKey}`;
        missingKeys.push(fullKey);
      }
    });
  };
  
  // Process the object
  processNested(translationObj, nestedObj);
  
  return { translationObj, missingKeys };
};

/**
 * Sort keys in an object (recursive)
 */
const sortObjectKeys = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  // Sort object keys
  return Object.keys(obj).sort().reduce((result, key) => {
    result[key] = typeof obj[key] === 'object' && obj[key] !== null
      ? sortObjectKeys(obj[key])
      : obj[key];
    return result;
  }, {});
};

module.exports = {
  buildNestedObject,
  deepMerge,
  addMissingTranslations,
  sortObjectKeys
};
