
/**
 * Format checking utilities for translations
 */

/**
 * Extract placeholders like {name} from a string
 */
const extractPlaceholders = (text) => {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches : [];
};

/**
 * Check HTML tags consistency
 */
const extractHtmlTags = (text) => {
  if (typeof text !== 'string') return [];
  const matches = text.match(/<[^>]+>/g);
  return matches ? matches : [];
};

/**
 * Find format inconsistencies (placeholders, HTML)
 */
const findFormatInconsistencies = (flatEn, flatFr) => {
  const issues = [];

  Object.keys(flatEn).forEach(key => {
    if (!flatFr[key]) return; // Skip already reported missing keys
    
    const enVal = flatEn[key];
    const frVal = flatFr[key];
    
    // Check placeholder consistency
    const enPlaceholders = extractPlaceholders(enVal);
    const frPlaceholders = extractPlaceholders(frVal);
    
    // Check for missing placeholders
    const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
    const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
    
    if (missingInFr.length > 0 || missingInEn.length > 0) {
      issues.push({
        key,
        en: enVal,
        fr: frVal,
        issue: 'placeholders',
        details: { missingInFr, missingInEn }
      });
    }
    
    // Check HTML tag consistency
    const enTags = extractHtmlTags(enVal);
    const frTags = extractHtmlTags(frVal);
    
    if (enTags.length !== frTags.length) {
      issues.push({
        key,
        en: enVal,
        fr: frVal,
        issue: 'htmlTags',
        details: { enTags, frTags }
      });
    }
  });
  
  return issues;
};

module.exports = {
  extractPlaceholders,
  extractHtmlTags,
  findFormatInconsistencies
};
