
#!/usr/bin/env node

/**
 * Apply Translation Fixes
 * 
 * This script applies fixes to translation issues automatically based on:
 * - Missing keys (generates placeholder translations)
 * - Format inconsistencies (fixes simple format issues)
 * - Generic keys (converts to specific hierarchical keys)
 * 
 * Usage:
 *   node apply-translation-fixes.js [--dry-run] [--specific=file.tsx]
 * 
 * Options:
 *   --dry-run      Only show what would be done without modifying files
 *   --specific     Apply fixes only to a specific file or directory
 */

const fs = require('fs');
const path = require('path');
const { findGenericKeyUsage } = require('./generic-keys/finder');
const { generateFixSuggestions, applyFixes } = require('./generic-keys/suggestions');
const { extractTranslationKeys } = require('./generators/extractors');
const { loadTranslations, writeTranslationFile } = require('./generators/fileOperations');
const { addMissingTranslations, sortObjectKeys } = require('./generators/objectUtils');

// Parse arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const specificTarget = args
  .find(arg => arg.startsWith('--specific='))
  ?.split('=')[1];

const mode = isDryRun ? 'DRY RUN' : 'APPLY FIXES';

// Configuration
const SOURCE_DIR = 'src';
const LOCALES_DIR = path.join('src', 'i18n', 'locales');
const LANGUAGES = ['en', 'fr'];
const GENERIC_KEYS = require('./generic-keys/config').genericKeys;

// Main function
const main = async () => {
  console.log(`\n🔧 Translation Fix Applier (${mode})`);
  console.log('============================');
  
  if (specificTarget) {
    console.log(`🎯 Targeting specific path: ${specificTarget}`);
  }
  
  const fixStats = {
    genericKeys: {
      found: 0,
      fixed: 0
    },
    missingTranslations: {
      en: 0,
      fr: 0
    },
    formatIssues: 0
  };
  
  // 1. Find and fix generic keys
  console.log('\n🔍 Step 1: Finding and fixing generic keys...');
  const genericKeyTargets = specificTarget || SOURCE_DIR;
  const occurrences = findGenericKeyUsage(GENERIC_KEYS, genericKeyTargets);
  
  fixStats.genericKeys.found = occurrences.length;
  
  if (occurrences.length > 0) {
    console.log(`Found ${occurrences.length} generic keys that need to be fixed.`);
    
    // Generate fixes
    const fixes = generateFixSuggestions(occurrences);
    
    if (!isDryRun) {
      // Apply fixes
      const applyResults = applyFixes(fixes);
      fixStats.genericKeys.fixed = applyResults.totalFixes;
      
      console.log(`✅ Applied ${applyResults.totalFixes} fixes to ${applyResults.totalFiles} files.`);
      if (applyResults.errors.length > 0) {
        console.log(`⚠️ Encountered ${applyResults.errors.length} errors:`);
        applyResults.errors.forEach(error => {
          console.log(`- ${error.file}: ${error.error}`);
        });
      }
    } else {
      console.log('[DRY RUN] Would fix the following generic keys:');
      fixes.forEach(fix => {
        console.log(`- ${fix.file}: "${fix.originalKey}" → "${fix.suggestedKey}"`);
      });
    }
  } else {
    console.log('✅ No generic keys found! All keys follow the convention.');
  }
  
  // 2. Add missing translations
  console.log('\n🔍 Step 2: Adding missing translation keys...');
  
  // Extract all translation keys from source files
  const sourceTarget = specificTarget || SOURCE_DIR;
  const { keys, keysWithContext } = extractTranslationKeys(sourceTarget);
  
  console.log(`Found ${keys.length} translation keys in the source code.`);
  
  // Process each language
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
    
    fixStats.missingTranslations[lang] = missingKeys.length;
    
    // Sort keys in the translation object
    const sortedTranslations = sortObjectKeys(translationObj);
    
    // Write updated translations to generated file
    writeTranslationFile(lang, sortedTranslations, LOCALES_DIR, isDryRun, true);
    
    console.log(`Found ${missingKeys.length} missing keys for ${lang}`);
    if (missingKeys.length > 0 && missingKeys.length <= 10) {
      console.log('Missing keys:', missingKeys.join(', '));
    }
  });
  
  // 3. Check format issues
  console.log('\n🔍 Step 3: Checking for format inconsistencies...');
  
  // In a complete implementation, this would check for placeholder inconsistencies
  // between languages and fix them. For now, we'll just report.
  console.log('Format inconsistency checking is not yet implemented in this script.');
  
  // Print summary
  console.log('\n✅ Summary:');
  console.log(`- Generic keys: ${fixStats.genericKeys.found} found, ${isDryRun ? '0 (dry run)' : fixStats.genericKeys.fixed} fixed`);
  console.log(`- Missing translations: ${fixStats.missingTranslations.en} in English, ${fixStats.missingTranslations.fr} in French`);
  
  console.log('\n📋 Next steps:');
  console.log('1. Review the generated translation files in:');
  LANGUAGES.forEach(lang => {
    console.log(`   - ${path.join(LOCALES_DIR, `${lang}.generated.json`)}`);
  });
  
  console.log('2. Copy the content to your main translation files:');
  LANGUAGES.forEach(lang => {
    console.log(`   - ${path.join(LOCALES_DIR, `${lang}.json`)}`);
  });
  
  console.log('3. Run the migration tracker to see the progress of your t() to I18nText migration');
  
  return fixStats;
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

module.exports = { main };
