
#!/usr/bin/env node

// This script adds NPM scripts to package.json for the translation tools
// Instead of directly modifying package.json, it will show instructions for the user

const fs = require('fs');
const path = require('path');

// Define the scripts we want to add
const scripts = {
  "i18n:scan": "node src/i18n/directUsageScanner.ts",
  "i18n:convert": "node src/i18n/convert-t-to-i18ntext.js",
  "i18n:check": "node src/i18n/check-translation-completeness.js",
  "i18n:pre-commit": "node src/i18n/pre-commit-hook.js",
  "i18n:export-csv": "node src/scripts/export-translation-status.js"
};

console.log('\n📌 Translation Scripts Registration');
console.log('================================\n');
console.log('Since package.json is read-only, please manually add these scripts to your package.json file:\n');

Object.entries(scripts).forEach(([name, command]) => {
  console.log(`    "${name}": "${command}",`);
});

console.log('\n✅ After adding these scripts, you can run them with:');
console.log('  npm run i18n:scan     - Find direct t() usage');
console.log('  npm run i18n:convert  - Convert t() to I18nText');
console.log('  npm run i18n:check    - Check translation completeness');
console.log('  npm run i18n:pre-commit - Run pre-commit hook manually');
console.log('  npm run i18n:export-csv - Export translation status to CSV\n');

// Create reference file for scripts
const packageScriptsPath = path.join(process.cwd(), 'src/package-scripts.js');
const packageScriptsContent = `/**
 * Custom scripts for Symbolica project
 * Add to package.json under "scripts" section:
 * 
 * "check-i18n": "node src/scripts/check-i18n-progress.js",
 * "migrate-i18n": "node src/i18n/convert-t-to-i18ntext.js",
 * "pre-commit": "node src/i18n/pre-commit-hook.js"
 */

// This file is just a reference and not executed directly
console.log('Please add these scripts to your package.json');
`;

fs.writeFileSync(packageScriptsPath, packageScriptsContent, 'utf-8');
console.log(`📄 Created reference file at ${packageScriptsPath}`);
