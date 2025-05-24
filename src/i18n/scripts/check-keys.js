
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const frTranslations = require('../locales/fr.json');
const enTranslations = require('../locales/en.json');

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const frKeys = new Set(getAllKeys(frTranslations));
const enKeys = new Set(getAllKeys(enTranslations));

const missingInFr = [...enKeys].filter(key => !frKeys.has(key));
const missingInEn = [...frKeys].filter(key => !enKeys.has(key));

console.log('🔍 Translation Key Analysis');
console.log('==========================');
console.log(`French keys: ${frKeys.size}`);
console.log(`English keys: ${enKeys.size}`);

if (missingInFr.length > 0) {
  console.log(`\n❌ Missing in French (${missingInFr.length}):`);
  missingInFr.forEach(key => console.log(`  - ${key}`));
}

if (missingInEn.length > 0) {
  console.log(`\n❌ Missing in English (${missingInEn.length}):`);
  missingInEn.forEach(key => console.log(`  - ${key}`));
}

if (missingInFr.length === 0 && missingInEn.length === 0) {
  console.log('\n✅ All translations are synchronized!');
}

process.exit(missingInFr.length + missingInEn.length > 0 ? 1 : 0);
