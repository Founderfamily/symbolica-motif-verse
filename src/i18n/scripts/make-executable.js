
#!/usr/bin/env node

/**
 * Make Translation Scripts Executable
 * 
 * This utility ensures all the translation scripts have executable permissions
 * on Unix-like systems (Linux, macOS).
 * 
 * Usage:
 *   node make-executable.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the list of script files
const i18nDir = path.resolve(__dirname, '..');
const scriptsDir = path.resolve(__dirname);

const scriptFiles = [
  path.join(i18nDir, 'convert-t-to-i18ntext.js'),
  path.join(i18nDir, 'check-translation-completeness.js'),
  path.join(i18nDir, 'pre-commit-hook.js'),
  path.join(scriptsDir, 'register-npm-scripts.js'),
  path.join(scriptsDir, 'run-all-fixes.js'),
  path.join(scriptsDir, 'find-direct-t-usage.js'),
  path.join(scriptsDir, 'make-executable.js')
];

// Check if we're on a Unix-like system
const isUnix = process.platform !== 'win32';

if (isUnix) {
  console.log('Making translation scripts executable...');
  
  scriptFiles.forEach(file => {
    if (fs.existsSync(file)) {
      try {
        fs.chmodSync(file, '755'); // rwxr-xr-x
        console.log(`✅ Made executable: ${path.basename(file)}`);
      } catch (error) {
        console.error(`❌ Failed to make executable: ${path.basename(file)}`, error.message);
      }
    } else {
      console.warn(`⚠️ File not found: ${path.basename(file)}`);
    }
  });
  
  console.log('\nAll scripts should now be executable. You can run them directly:');
  console.log('./src/i18n/scripts/run-all-fixes.js');
  
} else {
  console.log('Windows detected. Skipping chmod operation.');
  console.log('On Windows, run scripts using node:');
  console.log('node src/i18n/scripts/run-all-fixes.js');
}

// Register npm scripts
try {
  console.log('\nRegistering npm scripts...');
  execSync(`node ${path.join(scriptsDir, 'register-npm-scripts.js')}`, { 
    encoding: 'utf8',
    stdio: 'inherit'
  });
} catch (error) {
  console.error('❌ Failed to register npm scripts:', error.message);
}
