
#!/usr/bin/env node

/**
 * Validate the consistency of the i18n structure between French and English
 */

const fs = require('fs');
const path = require('path');

const getAllKeys = (obj, prefix = '') => {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
};

const loadTranslations = (lang) => {
  const localesDir = path.join(__dirname, '..', 'locales', lang);
  const files = fs.readdirSync(localesDir).filter(file => file.endsWith('.json'));
  
  let translations = {};
  
  files.forEach(file => {
    try {
      const filePath = path.join(localesDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const namespace = path.basename(file, '.json');
      
      if (namespace === 'fr' || namespace === 'en') {
        // Main translation file - merge directly
        Object.assign(translations, content);
      } else {
        // Namespaced file
        if (namespace === 'auth' || namespace === 'admin' || namespace === 'profile' || namespace === 'contributions' || namespace === 'gamification') {
          // These files have nested structure
          Object.assign(translations, content);
        } else {
          // Direct merge for navigation, common, etc.
          Object.assign(translations, content);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Could not load ${file}: ${error.message}`);
    }
  });
  
  return translations;
};

console.log('🔍 Validating i18n structure consistency...\n');

try {
  const frTranslations = loadTranslations('fr');
  const enTranslations = loadTranslations('en');
  
  const frKeys = new Set(getAllKeys(frTranslations));
  const enKeys = new Set(getAllKeys(enTranslations));
  
  const missingInFr = [...enKeys].filter(key => !frKeys.has(key));
  const missingInEn = [...frKeys].filter(key => !enKeys.has(key));
  
  console.log(`📊 Summary:`);
  console.log(`   French keys: ${frKeys.size}`);
  console.log(`   English keys: ${enKeys.size}`);
  
  if (missingInFr.length > 0) {
    console.log(`\n❌ Missing in French (${missingInFr.length}):`);
    missingInFr.slice(0, 10).forEach(key => console.log(`   • ${key}`));
    if (missingInFr.length > 10) {
      console.log(`   ... and ${missingInFr.length - 10} more`);
    }
  } else {
    console.log('\n✅ No keys missing in French!');
  }
  
  if (missingInEn.length > 0) {
    console.log(`\n❌ Missing in English (${missingInEn.length}):`);
    missingInEn.slice(0, 10).forEach(key => console.log(`   • ${key}`));
    if (missingInEn.length > 10) {
      console.log(`   ... and ${missingInEn.length - 10} more`);
    }
  } else {
    console.log('\n✅ No keys missing in English!');
  }
  
  const totalIssues = missingInFr.length + missingInEn.length;
  
  if (totalIssues === 0) {
    console.log('\n🎉 Perfect! All translations are synchronized!');
  } else {
    console.log(`\n⚠️ Found ${totalIssues} inconsistencies that need attention.`);
  }
  
  console.log('\n📝 Next steps:');
  console.log('   1. Fix missing translations');
  console.log('   2. Run migration script to convert I18nText to t()');
  console.log('   3. Test all pages in both languages');
  
  process.exit(totalIssues === 0 ? 0 : 1);
  
} catch (error) {
  console.error('❌ Error validating translations:', error.message);
  process.exit(1);
}
