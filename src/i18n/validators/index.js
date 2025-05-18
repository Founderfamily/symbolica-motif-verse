
#!/usr/bin/env node

/**
 * Comprehensive Translation Validation Utility
 * 
 * This script performs thorough validation of translation files:
 * - Missing keys between languages
 * - Format inconsistencies (placeholders, HTML tags)
 * - Structure consistency
 * - Key naming convention compliance
 * 
 * Usage:
 *   node check-translation-completeness.js [--fix] [--report=file.md]
 * 
 * Options:
 *   --fix       Attempt to automatically fix simple issues
 *   --report    Generate a markdown report file
 */

const fs = require('fs');
const path = require('path');
const { loadTranslations, flattenTranslations } = require('./loaders');
const { validateKeyFormat, findMissingKeys } = require('./validators');
const { findFormatInconsistencies } = require('./formatCheckers');
const { applyAutoFixes } = require('./autoFix');
const { generateReport, printResults } = require('./reporting');

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const reportArg = args.find(arg => arg.startsWith('--report='));
const reportPath = reportArg ? reportArg.split('=')[1] : 'translation-validation-report.md';

// Main validation function
const validateTranslations = () => {
  console.log('=== Translation Validation ===\n');
  
  // Load and flatten translations
  const localesDir = path.join(__dirname, '../locales');
  const translations = loadTranslations(localesDir);
  
  if (!translations) {
    return { exitCode: 1 };
  }
  
  const { en, fr } = translations;
  const flatEn = flattenTranslations(en);
  const flatFr = flattenTranslations(fr);
  
  // Results collections
  const results = {
    missingInFr: findMissingKeys(flatEn, flatFr),
    missingInEn: findMissingKeys(flatFr, flatEn),
    formatIssues: findFormatInconsistencies(flatEn, flatFr),
    keyFormatIssues: [],
    fixes: [],
    totalEnKeys: Object.keys(flatEn).length,
    totalFrKeys: Object.keys(flatFr).length
  };
  
  // Check key naming convention
  const allKeys = [...new Set([...Object.keys(flatEn), ...Object.keys(flatFr)])];
  results.keyFormatIssues = allKeys.filter(key => !validateKeyFormat(key));
  
  // Auto fix if requested
  if (shouldFix) {
    results.fixes = applyAutoFixes(en, fr, results.missingInFr, results.missingInEn);
    
    // Write back the fixed files
    if (results.fixes.length > 0) {
      fs.writeFileSync(
        path.join(localesDir, 'en.json'), 
        JSON.stringify(en, null, 2), 
        'utf8'
      );
      
      fs.writeFileSync(
        path.join(localesDir, 'fr.json'), 
        JSON.stringify(fr, null, 2), 
        'utf8'
      );
    }
  }
  
  // Print results
  printResults(results);
  
  // Generate markdown report if requested
  if (reportPath) {
    generateReport(results, { en: flatEn, fr: flatFr }, reportPath);
  }
  
  // Return exit code for CI usage
  const hasErrors = results.missingInFr.length > 0 || results.missingInEn.length > 0;
  
  return {
    exitCode: hasErrors ? 1 : 0,
    results
  };
};

// Run validation
const { exitCode } = validateTranslations();

// Exit with appropriate code for CI integration
if (require.main === module) {
  process.exit(exitCode);
}

module.exports = {
  validateTranslations
};
