
#!/usr/bin/env node

/**
 * Translation Key Generator
 * 
 * This script scans your project for I18nText usage and generates missing translation keys.
 * 
 * Usage:
 *   node i18n-generate-missing.js [--dry-run]
 * 
 * Options:
 *   --dry-run   Only show what would be done without modifying files
 */

const path = require('path');
const { extractTranslationKeys } = require('./extractors');
const { addMissingTranslations, sortObjectKeys } = require('./objectUtils');
const { loadTranslations, writeTranslationFile } = require('./fileOperations');
const { generateReport } = require('./reportGenerator');

// Parse arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const mode = isDryRun ? 'DRY RUN' : 'UPDATE';

// Configuration
const SOURCE_DIR = 'src';
const LOCALES_DIR = path.join('src', 'i18n', 'locales');
const LANGUAGES = ['en', 'fr'];

// Main function
const main = () => {
  console.log(`\n🌍 Translation Key Generator (${mode})`);
  console.log('=================================');
  
  // Extract all translation keys from source files
  const { keys, keysWithContext } = extractTranslationKeys(SOURCE_DIR);
  
  // Process each language
  const stats = {};
  const allMissingKeys = {};
  
  LANGUAGES.forEach(lang => {
    console.log(`\n📝 Processing ${lang} translations...`);
    
    // Load existing translations
    const existingTranslations = loadTranslations(lang, LOCALES_DIR);
    
    // Add missing translations
    const { translationObj, missingKeys } = addMissingTranslations(
      structuredClone(existingTranslations), 
      keys,
      lang
    );
    
    // Sort keys in the translation object
    const sortedTranslations = sortObjectKeys(translationObj);
    
    // Write updated translations to generated file
    writeTranslationFile(lang, sortedTranslations, LOCALES_DIR, isDryRun, true);
    
    // Save stats
    stats[lang] = {
      total: keys.length,
      existing: keys.length - missingKeys.length,
      missing: missingKeys.length
    };
    
    allMissingKeys[lang] = missingKeys;
    
    console.log(`Found ${missingKeys.length} missing keys for ${lang}`);
    if (missingKeys.length > 0 && missingKeys.length <= 10) {
      console.log('Missing keys:', missingKeys.join(', '));
    }
  });
  
  // Generate report
  generateReport(keysWithContext, allMissingKeys, LANGUAGES, isDryRun);
  
  // Print summary
  console.log('\n✅ Summary:');
  LANGUAGES.forEach(lang => {
    const { total, existing, missing } = stats[lang];
    const coverage = Math.round((existing / total) * 100);
    console.log(`- ${lang}: ${existing}/${total} keys (${coverage}% coverage), ${missing} missing`);
  });
  
  console.log('\n📋 Next steps:');
  console.log('1. Review the generated translation files in:');
  LANGUAGES.forEach(lang => {
    console.log(`   - ${path.join(LOCALES_DIR, `${lang}.generated.json`)}`);
  });
  
  console.log('2. Copy the content to your main translation files:');
  LANGUAGES.forEach(lang => {
    console.log(`   - ${path.join(LOCALES_DIR, `${lang}.json`)}`);
  });
  
  console.log('3. Replace placeholder values with proper translations');
  
  return { stats, allMissingKeys };
};

// Run the script
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { main, extractTranslationKeys };
