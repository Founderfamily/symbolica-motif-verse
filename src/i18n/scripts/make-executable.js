
#!/usr/bin/env node

/**
 * Make Scripts Executable
 * 
 * This script adds executable permissions to all the i18n scripts
 * so they can be run directly from the command line.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scriptsDir = path.join(__dirname, '.');
const i18nDir = path.join(__dirname, '..');

const scriptFiles = [
  // Main scripts
  path.join(i18nDir, 'convert-t-to-i18ntext.js'),
  path.join(i18nDir, 'check-translation-completeness.js'),
  path.join(i18nDir, 'directUsageScanner.ts'),
  path.join(i18nDir, 'pre-commit-hook.js'),
  
  // Scripts in scripts directory
  path.join(scriptsDir, 'i18n-generate-missing.js'),
  path.join(scriptsDir, 'find-generic-keys.js'),
  path.join(scriptsDir, 'run-all-fixes.js'),
  path.join(scriptsDir, 'find-direct-t-usage.js'),
  path.join(scriptsDir, 'make-executable.js'),
  path.join(scriptsDir, 'register-npm-scripts.js'),
  
  // Scripts in src/scripts
  path.join(process.cwd(), 'src', 'scripts', 'check-i18n-progress.js'),
  path.join(process.cwd(), 'src', 'scripts', 'export-translation-status.js')
];

console.log('🔧 Making scripts executable...');

scriptFiles.forEach(file => {
  try {
    if (fs.existsSync(file)) {
      // On Unix-like systems, make executable
      if (process.platform !== 'win32') {
        execSync(`chmod +x "${file}"`, { stdio: 'inherit' });
        console.log(`✅ Made executable: ${file}`);
      } else {
        console.log(`ℹ️ Skipped on Windows: ${file}`);
      }
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error with ${file}:`, error.message);
  }
});

console.log('\n✅ Done making scripts executable');

// Run the scripts with Node directly
console.log('\n🚀 Running the i18n-generate-missing script...');
try {
  require('./i18n-generate-missing.js').main();
} catch (error) {
  console.error('❌ Error running i18n-generate-missing.js:', error.message);
}

console.log('\n🔍 Running the find-generic-keys script...');
try {
  require('./find-generic-keys.js').main();
} catch (error) {
  console.error('❌ Error running find-generic-keys.js:', error.message);
}

console.log('\n🚀 Running the run-all-fixes script with auto-fix...');
try {
  // We have to execute this with Node since it might call other scripts
  const { execSync } = require('child_process');
  execSync('node ' + path.join(scriptsDir, 'run-all-fixes.js') + ' --auto-fix', { 
    stdio: 'inherit' 
  });
} catch (error) {
  console.error('❌ Error running run-all-fixes.js:', error.message);
}
