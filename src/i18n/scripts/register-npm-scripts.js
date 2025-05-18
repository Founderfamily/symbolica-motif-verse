
#!/usr/bin/env node

/**
 * This script adds translation-related npm scripts to package.json
 * 
 * Usage:
 *   node register-npm-scripts.js
 */

const fs = require('fs');
const path = require('path');

// Path to package.json
const packageJsonPath = path.resolve(__dirname, '../../../package.json');

// Check if package.json exists
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found at:', packageJsonPath);
  process.exit(1);
}

// Read the current package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Scripts to add
const scriptsToAdd = {
  "validate-translations": "node src/i18n/check-translation-completeness.js",
  "validate-translations:fix": "node src/i18n/check-translation-completeness.js --fix",
  "validate-translations:report": "node src/i18n/check-translation-completeness.js --report=translation-report.md",
  "scan-direct-usage": "node -r ts-node/register src/i18n/directUsageScanner.ts",
  "convert-t-to-i18ntext": "node src/i18n/convert-t-to-i18ntext.js",
  "i18n:pre-commit": "node src/i18n/pre-commit-hook.js"
};

// Add scripts if they don't exist
if (!packageJson.scripts) {
  packageJson.scripts = {};
}

let scriptsAdded = 0;
Object.entries(scriptsToAdd).forEach(([name, script]) => {
  if (!packageJson.scripts[name]) {
    packageJson.scripts[name] = script;
    scriptsAdded++;
  }
});

// Write updated package.json if changes were made
if (scriptsAdded > 0) {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf8');
  console.log(`✅ Added ${scriptsAdded} translation npm scripts to package.json`);
} else {
  console.log('✓ All translation scripts are already in package.json');
}

console.log('\nYou can now run these commands:');
Object.keys(scriptsToAdd).forEach(script => {
  console.log(`  npm run ${script}`);
});
