#!/usr/bin/env node
// Node.js script to validate translations
// Run with: node validateTranslations.js

const fs = require('fs');
const path = require('path');

// Load translation files
const en = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales/en.json'), 'utf8'));
const fr = JSON.parse(fs.readFileSync(path.join(__dirname, 'locales/fr.json'), 'utf8'));

// Validation functions
function findMissingKeys(source, target, prefix = '') {
  const missingKeys = [];
  
  for (const key in source) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
      // Recurse into nested objects
      if (!target[key] || typeof target[key] !== 'object') {
        missingKeys.push(fullKey);
      } else {
        missingKeys.push(...findMissingKeys(source[key], target[key], fullKey));
      }
    } else if (!target.hasOwnProperty(key)) {
      missingKeys.push(fullKey);
    }
  }
  
  return missingKeys;
}

function extractPlaceholders(text) {
  if (typeof text !== 'string') return [];
  const matches = text.match(/\{([^}]+)\}/g);
  return matches ? matches.map(m => m.replace(/[{}]/g, '')) : [];
}

function findFormatIssues(en, fr, prefix = '') {
  const issues = [];
  
  function checkValue(enValue, frValue, key) {
    // Check for placeholder differences
    const enPlaceholders = extractPlaceholders(enValue);
    const frPlaceholders = extractPlaceholders(frValue);
    
    // Different number of placeholders
    if (enPlaceholders.length !== frPlaceholders.length) {
      issues.push({
        key,
        en: enValue,
        fr: frValue,
        issue: 'placeholderCount'
      });
      return;
    }
    
    // Different placeholder names
    const missingInFr = enPlaceholders.filter(p => !frPlaceholders.includes(p));
    const missingInEn = frPlaceholders.filter(p => !enPlaceholders.includes(p));
    if (missingInFr.length > 0 || missingInEn.length > 0) {
      issues.push({
        key,
        en: enValue,
        fr: frValue,
        issue: 'placeholderNames',
        details: {
          missingInFr,
          missingInEn
        }
      });
    }
  }
  
  function compareObjects(enObj, frObj, currentPrefix = '') {
    for (const key in enObj) {
      const fullKey = currentPrefix ? `${currentPrefix}.${key}` : key;
      const enValue = enObj[key];
      const frValue = frObj?.[key];
      
      if (!frValue) continue; // Skip already reported missing keys
      
      if (typeof enValue === 'object' && enValue !== null && !Array.isArray(enValue)) {
        // Recurse into nested objects
        compareObjects(enValue, frValue, fullKey);
      } else if (typeof enValue === 'string' && typeof frValue === 'string') {
        // Compare string values
        checkValue(enValue, frValue, fullKey);
      }
    }
  }
  
  compareObjects(en, fr);
  return issues;
}

// Run validation
const missingInFrench = findMissingKeys(en, fr);
const missingInEnglish = findMissingKeys(fr, en);
const formatIssues = findFormatIssues(en, fr);

// Report results
console.log('Translation Validation Results:');
console.log('------------------------------');

if (missingInFrench.length > 0) {
  console.log(`\n❌ Missing in French (${missingInFrench.length} keys):`);
  missingInFrench.forEach(key => console.log(`- ${key}`));
}

if (missingInEnglish.length > 0) {
  console.log(`\n❌ Missing in English (${missingInEnglish.length} keys):`);
  missingInEnglish.forEach(key => console.log(`- ${key}`));
}

if (formatIssues.length > 0) {
  console.log(`\n❌ Format Issues (${formatIssues.length} keys):`);
  formatIssues.forEach(issue => {
    console.log(`- ${issue.key}:`);
    console.log(`  EN: ${issue.en}`);
    console.log(`  FR: ${issue.fr}`);
    console.log(`  Issue: ${issue.issue}`);
    if (issue.details) {
      if (issue.details.missingInEn.length > 0) {
        console.log(`  Missing in English: ${issue.details.missingInEn.join(', ')}`);
      }
      if (issue.details.missingInFr.length > 0) {
        console.log(`  Missing in French: ${issue.details.missingInFr.join(', ')}`);
      }
    }
  });
}

if (missingInFrench.length === 0 && missingInEnglish.length === 0 && formatIssues.length === 0) {
  console.log('✅ All translations are valid!');
  process.exit(0);
} else {
  console.log('\n❌ Translation validation failed');
  process.exit(1); // Exit with error code for CI/CD
}
