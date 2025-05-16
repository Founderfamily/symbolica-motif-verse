
#!/usr/bin/env node

/**
 * Convert Direct t() Usage to I18nText Components
 * 
 * This utility attempts to automatically convert direct t() calls to I18nText components.
 * It's meant as an aid, but manual review is still necessary after conversion.
 * 
 * Usage:
 *   node convert-t-to-i18ntext.js <file_path>
 * 
 * Example:
 *   node convert-t-to-i18ntext.js src/components/MyComponent.tsx
 */

const fs = require('fs');
const path = require('path');

// Check if file path is provided
if (process.argv.length < 3) {
  console.error('Please provide a file path to convert.');
  console.error('Usage: node convert-t-to-i18ntext.js <file_path>');
  process.exit(1);
}

const filePath = process.argv[2];

// Check if file exists
if (!fs.existsSync(filePath)) {
  console.error(`File does not exist: ${filePath}`);
  process.exit(1);
}

// Read the file content
const fileContent = fs.readFileSync(filePath, 'utf-8');
const lines = fileContent.split('\n');

// Regular expressions for finding t() calls
const directTCallRegex = /\{t\(['"`](.+?)['"`](?:,\s*\{.*?\})?\)\}/g;
const attributeTCallRegex = /(\w+)=\{t\(['"`](.+?)['"`](?:,\s*\{.*?\})?\)\}/g;

// Check if I18nText is already imported
let hasI18nTextImport = fileContent.includes("I18nText");
let newContent = [...lines];

// Add I18nText import if needed
if (!hasI18nTextImport) {
  // Find the last import statement
  const lastImportIndex = lines.reduce((lastIndex, line, index) => {
    if (line.trim().startsWith('import ')) {
      return index;
    }
    return lastIndex;
  }, -1);
  
  if (lastImportIndex !== -1) {
    // Add import after the last import
    newContent.splice(lastImportIndex + 1, 0, `import { I18nText } from '@/components/ui/i18n-text';`);
  } else {
    // Add at the top if no imports found
    newContent.unshift(`import { I18nText } from '@/components/ui/i18n-text';`);
  }
}

// Apply replacements
// Start from the end to avoid line number issues when making replacements
for (let i = lines.length - 1; i >= 0; i--) {
  const line = newContent[i];
  
  // Replace direct t() calls like {t('key')}
  let newLine = line.replace(directTCallRegex, (match, key) => {
    return `<I18nText translationKey="${key}" />`;
  });
  
  // Handle attribute t() calls like placeholder={t('key')}
  // This is more complex and often requires manual intervention
  if (newLine.match(attributeTCallRegex)) {
    // Add a comment to alert about manual review needed
    newContent[i] = newLine;
    newContent.splice(i, 0, `{/* TODO: Review this line for attribute t() usage conversion to I18nText */}`);
  } else if (newLine !== line) {
    newContent[i] = newLine;
  }
}

// Write the updated content
fs.writeFileSync(filePath, newContent.join('\n'), 'utf-8');

console.log(`✅ Converted direct t() calls to I18nText components in ${filePath}`);
console.log(`   Please review the file manually for any attribute t() usages that need further changes.`);
