
#!/usr/bin/env node

// This script adds NPM scripts to package.json for the translation tools

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Make the conversion script executable
try {
  execSync('chmod +x src/i18n/convert-t-to-i18ntext.js');
  console.log('✅ Made conversion script executable');
} catch (error) {
  console.error('Error making script executable:', error.message);
}

// Read package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
let packageJson;

try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
} catch (error) {
  console.error('Error reading package.json:', error.message);
  process.exit(1);
}

// Add our translation scripts
if (!packageJson.scripts) {
  packageJson.scripts = {};
}

// Add new scripts
const newScripts = {
  'i18n:convert': 'node src/i18n/convert-t-to-i18ntext.js',
  'i18n:validate': 'node src/i18n/validateTranslations.js',
  'i18n:check-direct': 'node src/i18n/scripts/find-direct-t-usage.js'
};

let scriptsAdded = false;

Object.entries(newScripts).forEach(([scriptName, scriptCommand]) => {
  if (!packageJson.scripts[scriptName]) {
    packageJson.scripts[scriptName] = scriptCommand;
    scriptsAdded = true;
    console.log(`✅ Added npm script: ${scriptName}`);
  }
});

if (!scriptsAdded) {
  console.log('ℹ️ All translation scripts already exist in package.json');
  process.exit(0);
}

// Write updated package.json
try {
  fs.writeFileSync(
    packageJsonPath, 
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf-8'
  );
  console.log('✅ Updated package.json with new scripts');
} catch (error) {
  console.error('Error writing package.json:', error.message);
  process.exit(1);
}

console.log('\n📝 You can now use these npm commands:');
console.log('  • npm run i18n:convert [file-path] - Convert t() calls to I18nText');
console.log('  • npm run i18n:validate - Validate translation completeness');
console.log('  • npm run i18n:check-direct - Find direct t() usage in code');
