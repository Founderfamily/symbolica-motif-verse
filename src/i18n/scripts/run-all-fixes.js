#!/usr/bin/env node

/**
 * Translation System - Run All Fixes
 * 
 * This script runs all translation tools to:
 * 1. Scan for direct t() usage and convert to I18nText where possible
 * 2. Check for missing translations and inconsistencies
 * 3. Generate a comprehensive report
 * 
 * Usage:
 *   node run-all-fixes.js [--auto-fix] [--ignore-errors]
 * 
 * Options:
 *   --auto-fix       Attempt to automatically fix issues when possible
 *   --ignore-errors  Continue even if some steps fail (exit code 0)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

// Parse command-line arguments
const args = process.argv.slice(2);
const shouldAutoFix = args.includes('--auto-fix');
const ignoreErrors = args.includes('--ignore-errors');

// Configuration
const config = {
  srcDir: path.resolve(__dirname, '../../'),
  componentsToScan: [
    'src/components/**/*.tsx',
    'src/pages/**/*.tsx',
    'src/App.tsx'
  ],
  reportPath: 'translation-report.md'
};

console.log('=== Translation System - Run All Fixes ===\n');
console.log(`Mode: ${shouldAutoFix ? 'Auto Fix' : 'Scan Only'}`);

let errors = [];
let fixes = 0;

try {
  // Step 1: Find components with direct t() usage
  console.log('\n🔍 Step 1: Scanning for direct t() usage...');
  
  // Use the scanner in silent mode to get the results programmatically
  const tUsageScan = () => {
    try {
      // This requires typescript to run, so we need to use ts-node
      const command = `node -r ts-node/register ${config.srcDir}/i18n/directUsageScanner.ts`;
      return execSync(command, { encoding: 'utf8' });
    } catch (error) {
      console.error('Error scanning for direct t() usage:', error.message);
      return null;
    }
  };
  
  const scanOutput = tUsageScan();
  
  // Find files with direct t() usage
  let filesToFix = [];
  
  if (scanOutput && scanOutput.includes('Found')) {
    console.log(scanOutput.split('\n')[0]); // Print first line of output
    
    // Extract files from output (very basic parsing)
    const filesMatch = scanOutput.match(/- ([^:]+):/g);
    if (filesMatch) {
      filesToFix = filesMatch.map(match => match.substring(2, match.length - 1));
      console.log(`Found ${filesToFix.length} files with direct t() usage`);
    }
  } else {
    console.log('✅ No direct t() usage found');
  }
  
  // Step 2: Convert direct t() usage if auto-fix is enabled
  if (shouldAutoFix && filesToFix.length > 0) {
    console.log('\n🔧 Step 2: Converting direct t() usage to I18nText...');
    
    let convertedCount = 0;
    for (const file of filesToFix) {
      try {
        console.log(`   Converting ${file}...`);
        execSync(`node ${config.srcDir}/i18n/convert-t-to-i18ntext.js ${file}`, { 
          encoding: 'utf8', 
          stdio: 'inherit' 
        });
        convertedCount++;
        fixes++;
      } catch (error) {
        console.error(`❌ Error converting ${file}:`, error.message);
        errors.push(`Failed to convert ${file}: ${error.message}`);
      }
    }
    
    console.log(`✅ Converted ${convertedCount} files to use I18nText`);
  }
  
  // Step 3: Check for translation completeness
  console.log('\n🔍 Step 3: Checking translation completeness...');
  
  const checkCommand = `node ${config.srcDir}/i18n/check-translation-completeness.js${shouldAutoFix ? ' --fix' : ''} --report=${config.reportPath}`;
  
  try {
    execSync(checkCommand, { encoding: 'utf8', stdio: 'inherit' });
    
    if (shouldAutoFix) {
      console.log('✅ Fixed missing translations where possible');
      fixes++;
    }
  } catch (error) {
    console.error('❌ Error checking translations:', error.message);
    errors.push(`Translation check failed: ${error.message}`);
  }
  
  // Summary
  console.log('\n=== Summary ===');
  
  if (errors.length === 0) {
    console.log('✅ All operations completed successfully');
  } else {
    console.log(`❌ Completed with ${errors.length} errors:`);
    errors.forEach(error => console.log(`   - ${error}`));
  }
  
  if (fixes > 0) {
    console.log(`✅ Applied ${fixes} fixes to the translation system`);
  }
  
  console.log(`📝 Generated report at: ${config.reportPath}`);
  
  // Action items
  console.log('\n=== Next Steps ===');
  console.log('1. Review the translation report');
  console.log('2. Test the application to ensure all translations work correctly');
  
  if (shouldAutoFix) {
    console.log('3. Commit the changes to your repository');
  } else {
    console.log('3. Run again with --auto-fix to apply fixes');
  }
  
  // Exit with appropriate code
  if (errors.length > 0 && !ignoreErrors) {
    process.exit(1);
  } else {
    process.exit(0);
  }
  
} catch (error) {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
}
