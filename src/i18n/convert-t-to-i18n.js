
#!/usr/bin/env node

/**
 * This script helps identify and convert direct t() calls to I18nText components
 * Usage: node convert-t-to-i18n.js [file path]
 */

const fs = require('fs');
const path = require('path');

// Check if file path is provided
if (process.argv.length < 3) {
  console.error('Usage: node convert-t-to-i18n.js [file path]');
  process.exit(1);
}

const filePath = process.argv[2];

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

// Read the file
const fileContent = fs.readFileSync(filePath, 'utf8');
const lines = fileContent.split('\n');

// Look for direct t() calls
let hasI18nImport = fileContent.includes('I18nText');
const directCallPattern = /\{t\(['"`]([^)]+)['"`]\)\}/g;
const translationKeys = [];
const changes = [];

// First pass - collect translation keys
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let match;
  while ((match = directCallPattern.exec(line)) !== null) {
    translationKeys.push({
      key: match[1],
      lineNumber: i,
      originalText: match[0],
      replacement: `<I18nText translationKey="${match[1]}" />`
    });
  }
}

// Add I18nText import if needed
if (translationKeys.length > 0 && !hasI18nImport) {
  // Find the last import line
  let lastImportLine = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('import ')) {
      lastImportLine = i;
    }
  }
  
  if (lastImportLine !== -1) {
    lines.splice(lastImportLine + 1, 0, `import { I18nText } from '@/components/ui/i18n-text';`);
    // Adjust line numbers since we've added a new line
    translationKeys.forEach(key => {
      if (key.lineNumber > lastImportLine) {
        key.lineNumber++;
      }
    });
  }
}

// Make replacements (working backward to avoid issues with line numbers)
translationKeys.sort((a, b) => b.lineNumber - a.lineNumber);

translationKeys.forEach(key => {
  const line = lines[key.lineNumber];
  lines[key.lineNumber] = line.replace(key.originalText, key.replacement);
  changes.push(`Line ${key.lineNumber + 1}: ${key.originalText} -> ${key.replacement}`);
});

// Write the file
fs.writeFileSync(filePath, lines.join('\n'), 'utf8');

console.log(`Converted ${translationKeys.length} direct t() calls to I18nText components in ${filePath}`);
if (changes.length > 0) {
  console.log('\nChanges made:');
  changes.forEach(change => console.log(` - ${change}`));
}
