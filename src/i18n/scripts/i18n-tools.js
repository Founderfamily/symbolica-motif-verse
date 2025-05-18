
#!/usr/bin/env node

/**
 * I18n Tools - Command Line Interface
 * 
 * This script provides a unified interface to all the i18n tooling.
 * 
 * Usage:
 *   node i18n-tools.js <command> [options]
 * 
 * Commands:
 *   scan                   Scan for translation issues
 *   convert <file>         Convert a file from t() to I18nText
 *   fix-all                Attempt to fix all issues
 *   check                  Check for missing translations
 *   validate               Run all validation
 * 
 * Options:
 *   --report=<file>        Generate a report file
 *   --fix                  Apply automatic fixes when possible
 *   --threshold=<number>   Set error threshold for direct t() usage
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Command line parsing
const args = process.argv.slice(2);
const command = args[0];

if (!command) {
  showHelp();
  process.exit(0);
}

const scriptDir = path.dirname(__dirname);
const baseDir = path.join(scriptDir, '..', '..');

// Execute the requested command
try {
  switch (command) {
    case 'scan':
      runScan();
      break;
    case 'convert':
      if (args.length < 2) {
        console.error('Missing file path. Usage: i18n-tools.js convert <file>');
        process.exit(1);
      }
      runConvert(args[1]);
      break;
    case 'fix-all':
      runFixAll();
      break;
    case 'check':
      runCheck();
      break;
    case 'validate':
      runValidate();
      break;
    case 'help':
      showHelp();
      break;
    default:
      console.error(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
} catch (error) {
  console.error(`Error executing command: ${error.message}`);
  process.exit(1);
}

function showHelp() {
  console.log(`
I18n Tools - Command Line Interface

Usage:
  node i18n-tools.js <command> [options]

Commands:
  scan                   Scan for translation issues
  convert <file>         Convert a file from t() to I18nText
  fix-all                Attempt to fix all issues
  check                  Check for missing translations
  validate               Run all validation
  help                   Show this help message

Options:
  --report=<file>        Generate a report file
  --fix                  Apply automatic fixes when possible
  --threshold=<number>   Set error threshold for direct t() usage

Examples:
  node i18n-tools.js scan --report=report.md
  node i18n-tools.js convert src/components/MyComponent.tsx
  node i18n-tools.js fix-all
  `);
}

function runScan() {
  console.log('🔍 Scanning for translation issues...');
  
  const options = args.slice(1).join(' ');
  const command = `node ${path.join(scriptDir, 'scripts', 'scan-all.js')} ${options}`;
  
  execSync(command, { stdio: 'inherit' });
}

function runConvert(filePath) {
  console.log(`🔄 Converting ${filePath}...`);
  
  const command = `node ${path.join(scriptDir, 'scripts', 'convert-file.js')} ${filePath}`;
  execSync(command, { stdio: 'inherit' });
}

function runFixAll() {
  console.log('🔧 Attempting to fix all issues...');
  
  const options = args.slice(1).join(' ');
  const command = `node ${path.join(scriptDir, 'scripts', 'run-all-fixes.js')} --auto-fix ${options}`;
  
  execSync(command, { stdio: 'inherit' });
}

function runCheck() {
  console.log('🔍 Checking for missing translations...');
  
  const options = args.slice(1).join(' ');
  const command = `node ${path.join(scriptDir, 'check-translation-completeness.js')} ${options}`;
  
  execSync(command, { stdio: 'inherit' });
}

function runValidate() {
  console.log('✅ Running all validation checks...');
  
  try {
    // Check for missing translations
    console.log('\n--- Checking for missing translations ---');
    execSync(`node ${path.join(scriptDir, 'check-translation-completeness.js')}`, { stdio: 'inherit' });
    
    // Scan for direct t() usage
    console.log('\n--- Scanning for direct t() usage ---');
    execSync(`node -r ts-node/register ${path.join(scriptDir, 'directUsageScanner.ts')} ${baseDir}`, { stdio: 'inherit' });
    
    console.log('\n✅ All validation checks completed');
  } catch (error) {
    console.error('\n❌ Validation failed:', error.message);
    process.exit(1);
  }
}
