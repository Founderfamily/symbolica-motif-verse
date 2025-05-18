
/**
 * Translation validation utilities
 */

/**
 * Validate key naming convention
 */
const validateKeyFormat = (key) => {
  // Keys should follow: namespace.section.element[.qualifier]
  const keyPattern = /^[a-z0-9]+(\.[a-z0-9]+){2,4}$/;
  return keyPattern.test(key);
};

/**
 * Find keys missing in each language
 */
const findMissingKeys = (flatSource, flatTarget) => {
  return Object.keys(flatSource).filter(key => !flatTarget[key]);
};

module.exports = {
  validateKeyFormat,
  findMissingKeys
};
