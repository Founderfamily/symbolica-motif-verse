
#!/usr/bin/env node

/**
 * CI/CD Translation Scanner
 * 
 * This script is designed to run in CI/CD environments to scan for direct t() usage.
 * It will exit with a non-zero code if direct t() usage is found.
 * 
 * Usage:
 *   node ci-translation-scanner.js [threshold]
 * 
 * Example:
 *   node ci-translation-scanner.js 10   # Allow up to 10 usages before failing
 */

const { scanDirectUsage } = require('./directUsageScanner');

// Run scan and report results
const runScan = () => {
  console.log('🔍 Running direct t() usage scan in CI mode...');
  
  // Get optional threshold from command arguments
  const threshold = parseInt(process.argv[2], 10) || 0;
  console.log(`Using threshold: ${threshold} direct usages allowed`);
  
  const results = scanDirectUsage('src');
  const totalInstances = results.reduce((sum, file) => sum + file.lines.length, 0);
  
  if (results.length === 0) {
    console.log('✅ Great job! No direct t() usage detected.');
    process.exit(0);
    return;
  }
  
  // Print summary
  console.log(`\nFound ${totalInstances} instances of direct t() usage across ${results.length} files:`);
  
  // For CI, show a condensed report with file counts
  results.forEach(file => {
    console.log(`- ${file.file}: ${file.lines.length} instances`);
  });
  
  // Show most-offending files
  const sortedResults = [...results].sort((a, b) => b.lines.length - a.lines.length);
  console.log('\nTop 5 files to fix:');
  sortedResults.slice(0, 5).forEach((file, index) => {
    console.log(`${index + 1}. ${file.file} (${file.lines.length} instances)`);
  });
  
  // Show example lines from the most-offending file
  if (sortedResults.length > 0) {
    const worstFile = sortedResults[0];
    console.log(`\nExample issues from ${worstFile.file}:`);
    worstFile.lines.slice(0, 3).forEach(line => {
      console.log(`  Line ${line.lineNumber}: ${line.content}`);
    });
    console.log('\nUse the converter to fix this file:');
    console.log(`  node src/i18n/convert-t-to-i18ntext.js ${worstFile.file}`);
  }
  
  // Check if we're within threshold
  if (totalInstances <= threshold) {
    console.log(`\n⚠️ Found ${totalInstances} direct t() usages, but within threshold of ${threshold}.`);
    console.log('Build will continue, but please fix these issues.');
    process.exit(0);
  } else {
    console.error(`\n❌ Found ${totalInstances} direct t() usages, exceeding threshold of ${threshold}.`);
    console.error('Please replace with <I18nText> component.');
    process.exit(1);
  }
};

// Execute if run directly
if (require.main === module) {
  runScan();
}

module.exports = { runScan };
