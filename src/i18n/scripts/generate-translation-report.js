
#!/usr/bin/env node

/**
 * Translation System - Generate Comprehensive Report
 * 
 * This script generates a detailed report of the translation system status:
 * - Missing translation keys
 * - Generic keys that need fixing
 * - Migration progress from direct t() usage to I18nText
 * 
 * Usage:
 *   node generate-translation-report.js [--csv] [--json]
 * 
 * Options:
 *   --csv    Export results to CSV file
 *   --json   Export results to JSON file
 */

const fs = require('fs');
const path = require('path');
const { findGenericKeyUsage } = require('./generic-keys/finder');
const { genericKeys } = require('./generic-keys/config');
const { main: scanDirectUsage } = require('../scripts/check-i18n-progress');
const { extractTranslationKeys } = require('./generators/extractors');
const { loadTranslations } = require('./generators/fileOperations');
const { findMissingKeys } = require('../validators/validators');

// Parse arguments
const args = process.argv.slice(2);
const shouldExportCsv = args.includes('--csv');
const shouldExportJson = args.includes('--json');

// Configuration
const LOCALES_DIR = path.join(process.cwd(), 'src', 'i18n', 'locales');
const REPORT_DIR = path.join(process.cwd(), 'src', 'i18n', 'reports');
const LANGUAGES = ['en', 'fr'];

// Ensure reports directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

/**
 * Generate a comprehensive translation report
 */
const generateReport = async () => {
  console.log('🔍 Generating comprehensive translation report...');
  
  // 1. Scan for generic keys
  console.log('\nScanning for generic keys...');
  const genericKeyOccurrences = findGenericKeyUsage(genericKeys);
  
  // 2. Scan for direct t() usage vs. I18nText
  console.log('\nAnalyzing migration progress...');
  const migrationResults = scanDirectUsage();
  
  // 3. Identify missing translation keys
  console.log('\nIdentifying missing translation keys...');
  
  // Extract all translation keys from source
  const { keys } = extractTranslationKeys('src');
  
  // Load current translations
  const translations = {};
  for (const lang of LANGUAGES) {
    translations[lang] = loadTranslations(lang, LOCALES_DIR);
  }
  
  // Find missing keys for each language
  const missingKeys = {};
  for (const lang of LANGUAGES) {
    missingKeys[lang] = [];
    
    for (const key of keys) {
      const keyParts = key.split('.');
      let current = translations[lang];
      let isMissing = false;
      
      // Check if the key exists in the nested structure
      for (const part of keyParts) {
        if (!current || !current[part]) {
          isMissing = true;
          break;
        }
        current = current[part];
      }
      
      if (isMissing) {
        missingKeys[lang].push(key);
      }
    }
  }
  
  // 4. Summarize results
  const report = {
    generatedAt: new Date().toISOString(),
    genericKeys: {
      count: genericKeyOccurrences.length,
      occurrences: genericKeyOccurrences
    },
    migration: migrationResults,
    missingTranslations: {
      totalKeysFound: keys.length,
      byLanguage: {}
    }
  };
  
  // Add missing translation details
  for (const lang of LANGUAGES) {
    report.missingTranslations.byLanguage[lang] = {
      count: missingKeys[lang].length,
      coverage: ((keys.length - missingKeys[lang].length) / keys.length * 100).toFixed(1),
      keys: missingKeys[lang]
    };
  }
  
  // 5. Output report
  console.log('\n=== Translation System Report ===');
  console.log(`Generated: ${new Date().toLocaleString()}`);
  console.log(`\n1. Generic Keys: ${report.genericKeys.count} occurrences found`);
  console.log(`2. Migration Progress: ${migrationResults.migratedFiles}/${migrationResults.totalFiles} files (${migrationResults.migrationPercentage}%)`);
  console.log('3. Missing Translations:');
  
  for (const lang of LANGUAGES) {
    const langReport = report.missingTranslations.byLanguage[lang];
    console.log(`   - ${lang}: ${langReport.count} missing keys (${langReport.coverage}% coverage)`);
  }
  
  // 6. Export report if requested
  if (shouldExportJson) {
    const jsonPath = path.join(REPORT_DIR, 'translation-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
    console.log(`\n📄 JSON report saved to: ${jsonPath}`);
  }
  
  if (shouldExportCsv) {
    exportCsvReport(report);
  }
  
  console.log('\n=== Next Steps ===');
  console.log('1. Run the missing keys generator to add missing translations:');
  console.log('   node src/i18n/scripts/i18n-generate-missing.js --merge');
  console.log('2. Fix generic keys:');
  console.log('   node src/i18n/scripts/find-generic-keys.js --fix');
  console.log('3. Complete the migration to I18nText:');
  console.log('   node src/scripts/check-i18n-progress.js');
  
  return report;
};

/**
 * Export report to CSV files
 */
const exportCsvReport = (report) => {
  // Export missing translations CSV
  const missingKeysPath = path.join(REPORT_DIR, 'missing-translations.csv');
  let missingKeysCsv = 'Key,Language\n';
  
  for (const lang of LANGUAGES) {
    const langKeys = report.missingTranslations.byLanguage[lang].keys;
    langKeys.forEach(key => {
      missingKeysCsv += `"${key}","${lang}"\n`;
    });
  }
  
  fs.writeFileSync(missingKeysPath, missingKeysCsv);
  
  // Export generic keys CSV
  const genericKeysPath = path.join(REPORT_DIR, 'generic-keys.csv');
  let genericKeysCsv = 'File,Line,Key,Suggestion\n';
  
  report.genericKeys.occurrences.forEach(occurrence => {
    genericKeysCsv += `"${occurrence.file}",${occurrence.lineNumber},"${occurrence.key}","component.section.${occurrence.key.toLowerCase()}"\n`;
  });
  
  fs.writeFileSync(genericKeysPath, genericKeysCsv);
  
  // Export migration progress CSV
  const migrationPath = path.join(REPORT_DIR, 'migration-progress.csv');
  let migrationCsv = 'File,Status,tUsages,I18nTextUsages,Percentage\n';
  
  const { totalFiles, migratedFiles, partiallyMigrated, notMigrated, migrationPercentage } = report.migration;
  
  migrationCsv += `"Summary","${migrationPercentage}% Complete",${notMigrated},${migratedFiles},${migrationPercentage}\n`;
  
  fs.writeFileSync(migrationPath, migrationCsv);
  
  console.log(`\n📄 CSV reports saved to:
  - ${missingKeysPath}
  - ${genericKeysPath}
  - ${migrationPath}`);
};

// Run the report generator if called directly
if (require.main === module) {
  generateReport()
    .then(() => console.log('\n✅ Report generation completed!'))
    .catch(err => {
      console.error('❌ Error generating report:', err);
      process.exit(1);
    });
}

module.exports = { generateReport };
