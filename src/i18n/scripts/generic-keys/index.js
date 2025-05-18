
#!/usr/bin/env node

/**
 * Generic Translation Key Finder
 * 
 * This script identifies generic translation keys like "Title", "Subtitle" that
 * should be replaced with more specific hierarchical keys.
 * 
 * Usage:
 *   node find-generic-keys.js [--detail]
 * 
 * Options:
 *   --detail   Show detailed information about each occurrence
 */

const { genericKeys } = require('./config');
const { findGenericKeyUsage } = require('./finder');
const { generateReport, printResults } = require('./reporting');

// Parse arguments
const args = process.argv.slice(2);
const showDetail = args.includes('--detail');

// Main function
const main = () => {
  console.log('🔍 Scanning for generic translation keys...');
  
  const occurrences = findGenericKeyUsage(genericKeys);
  
  console.log(`\nFound ${occurrences.length} generic translation keys.`);
  
  if (occurrences.length === 0) {
    console.log('Great job! No generic keys found.');
    return { success: true, count: 0 };
  }
  
  // Print results grouped by file
  printResults(occurrences, showDetail);
  
  // Generate report file
  generateReport(occurrences);
  
  console.log('\n🔧 How to fix:');
  console.log('1. Replace generic keys with specific hierarchical keys like:');
  console.log('   "page.section.component.purpose"');
  console.log('2. Update your translation files with the new keys');
  console.log('3. Run the missing keys generator to ensure all keys are defined:');
  console.log('   node src/i18n/scripts/i18n-generate-missing.js');
  
  return { success: true, count: occurrences.length };
};

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main, findGenericKeyUsage };
