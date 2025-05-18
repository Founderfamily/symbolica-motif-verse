
#!/usr/bin/env node

/**
 * Convert Single File Tool
 * 
 * This is a simplified version of the full converter utility.
 * It processes a single file and converts direct t() usage to I18nText.
 * 
 * Usage:
 *   node convert-file.js <file_path>
 * 
 * Example:
 *   node convert-file.js src/components/MyComponent.tsx
 */

const fs = require('fs');
const path = require('path');

// Check if file path is provided
if (process.argv.length < 3) {
  console.error('Please provide a file path to convert.');
  console.error('Usage: node convert-file.js <file_path>');
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

// Regular expressions for finding different patterns of t() calls
const patterns = {
  // Standard t() in JSX: {t('key')}
  directTCallRegex: /\{t\(['"`](.+?)['"`](?:,\s*\{.*?\})?\)\}/g,
  
  // t() in attributes: placeholder={t('key')}
  attributeTCallRegex: /(\w+)=\{t\(['"`](.+?)['"`](?:,\s*\{.*?\})?\)\}/g,
  
  // t() with parameters: {t('key', { param: value })}
  paramTCallRegex: /\{t\(['"`](.+?)['"`],\s*(\{.+?\})\)\}/g,
  
  // Multiline t() calls
  multilineTCallRegex: /\{\s*t\s*\(\s*['"]([\w.-]+)['"]\s*\)\s*\}/g
};

// Check if I18nText is already imported
let hasI18nTextImport = fileContent.includes("I18nText");
let newContent = [...lines];

// Add I18nText import if needed
if (!hasI18nTextImport && fileContent.includes('t(')) {
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

// Track replacements
let replacements = 0;

// Process each line
for (let i = 0; i < newContent.length; i++) {
  let line = newContent[i];
  
  // Skip comments
  if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
    continue;
  }
  
  // Handle param cases first (more specific)
  let paramMatches = [...line.matchAll(patterns.paramTCallRegex)];
  if (paramMatches.length > 0) {
    // This is a more complex case, let's add a TODO comment for manual review
    newContent.splice(i, 0, `{/* TODO: Parameter case needs manual review: ${line.trim()} */}`);
    i++; // Skip the next line since we added one
    continue;
  }
  
  // Handle attribute cases
  let attrMatches = [...line.matchAll(patterns.attributeTCallRegex)];
  if (attrMatches.length > 0) {
    // Add a TODO for manual review
    newContent.splice(i, 0, `{/* TODO: Attribute translation needs manual review: ${line.trim()} */}`);
    i++;
    continue;
  }
  
  // Replace direct t() calls (simplest case)
  const updatedLine = line.replace(patterns.directTCallRegex, (match, key) => {
    replacements++;
    return `<I18nText translationKey="${key}" />`;
  });
  
  // Replace multiline t() calls
  const updatedMultiline = updatedLine.replace(patterns.multilineTCallRegex, (match, key) => {
    replacements++;
    return `<I18nText translationKey="${key}" />`;
  });
  
  // Update the line if changes were made
  if (updatedLine !== line || updatedMultiline !== line) {
    newContent[i] = updatedMultiline;
  }
}

// Write the updated content
fs.writeFileSync(filePath, newContent.join('\n'), 'utf-8');

console.log(`✅ Processed ${filePath}`);
console.log(`   Made ${replacements} replacements`);

if (replacements > 0) {
  console.log('\n⚠️ This was a simple conversion that only handles basic cases.');
  console.log('   You may need to manually adjust some complex cases.');
  console.log('   Please review the changes carefully.');
}
