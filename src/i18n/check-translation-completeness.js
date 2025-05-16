
#!/usr/bin/env node

/**
 * Check Translation Completeness
 * 
 * This script compares translation files to find missing keys and inconsistencies.
 * 
 * Usage:
 *   node check-translation-completeness.js
 */

const fs = require('fs');
const path = require('path');

// Paths to translation files
const en = require('../i18n/locales/en.json');
const fr = require('../i18n/locales/fr.json');

// Flatten the nested structure of a translation file
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

// Flatten both translation files
const flatEn = flattenTranslations(en);
const flatFr = flattenTranslations(fr);

// Find keys in English that are missing in French
const missingInFr = Object.keys(flatEn).filter(key => !flatFr[key]);

// Find keys in French that are missing in English
const missingInEn = Object.keys(flatFr).filter(key => !flatEn[key]);

// Find keys with different format (could indicate potential issues)
const differentFormat = Object.keys(flatEn).filter(key => {
  if (!flatFr[key]) return false;
  
  const enVal = flatEn[key];
  const frVal = flatFr[key];
  
  if (typeof enVal !== typeof frVal) return true;
  
  // Check for placeholder differences like {name} vs no placeholder
  if (typeof enVal === 'string' && typeof frVal === 'string') {
    const enPlaceholders = (enVal.match(/\{[^}]+\}/g) || []).sort();
    const frPlaceholders = (frVal.match(/\{[^}]+\}/g) || []).sort();
    
    if (JSON.stringify(enPlaceholders) !== JSON.stringify(frPlaceholders)) {
      return true;
    }
  }
  
  return false;
});

// Print results
console.log('=== Translation Completeness Check ===\n');

if (missingInFr.length === 0) {
  console.log('✅ All English keys are present in French');
} else {
  console.log(`❌ ${missingInFr.length} English keys are missing in French:`);
  missingInFr.forEach(key => console.log(` - ${key}`));
}

console.log('');

if (missingInEn.length === 0) {
  console.log('✅ All French keys are present in English');
} else {
  console.log(`❌ ${missingInEn.length} French keys are missing in English:`);
  missingInEn.forEach(key => console.log(` - ${key}`));
}

console.log('');

if (differentFormat.length === 0) {
  console.log('✅ All translations have consistent formats');
} else {
  console.log(`⚠️ ${differentFormat.length} keys have different formats between languages:`);
  differentFormat.forEach(key => {
    console.log(` - ${key}:`);
    console.log(`   EN: ${flatEn[key]}`);
    console.log(`   FR: ${flatFr[key]}`);
  });
}

console.log('\n=== Summary ===');
console.log(`Total English keys: ${Object.keys(flatEn).length}`);
console.log(`Total French keys: ${Object.keys(flatFr).length}`);
console.log(`Completion rate: ${Math.round((Object.keys(flatEn).length - missingInFr.length) / Object.keys(flatEn).length * 100)}%`);
