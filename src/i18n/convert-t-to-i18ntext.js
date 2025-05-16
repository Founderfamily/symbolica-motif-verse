
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
const { scanSingleFile } = require('./directUsageScanner');

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

// Scan for direct t() usage
const scanResult = scanSingleFile(filePath);

if (!scanResult || scanResult.lines.length === 0) {
  console.log(`✅ No direct t() usage found in ${filePath}`);
  process.exit(0);
}

console.log(`Found ${scanResult.lines.length} instances of direct t() usage in ${filePath}`);

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
    
    // Update line numbers for scan results (they're now shifted by 1)
    scanResult.lines.forEach(line => {
      if (line.lineNumber > lastImportIndex) {
        line.lineNumber++;
      }
    });
  } else {
    // Add at the top if no imports found
    newContent.unshift(`import { I18nText } from '@/components/ui/i18n-text';`);
    
    // All line numbers are now shifted by 1
    scanResult.lines.forEach(line => {
      line.lineNumber++;
    });
  }
}

// Extract keys and process replacements
// Start from the end to avoid line number issues when making replacements
scanResult.lines.sort((a, b) => b.lineNumber - a.lineNumber);

// Apply replacements
let replacementCount = 0;
const attributeReplacements = [];
const directReplacements = [];

scanResult.lines.forEach(lineInfo => {
  const lineNumber = lineInfo.lineNumber - 1; // Zero-based index
  const originalLine = newContent[lineNumber];
  
  // Try to extract the key
  const keyMatches = originalLine.match(/t\(['"`](.+?)['"`]/g);
  if (!keyMatches) return;
  
  keyMatches.forEach(keyMatch => {
    const key = keyMatch.match(/t\(['"`](.+?)['"`]/)[1];
    
    // Check if this is an attribute (like placeholder={t('key')})
    if (originalLine.match(new RegExp(`\\w+=\\{t\\(['"\`]${key}['"\`]\\)`))) {
      attributeReplacements.push({
        lineNumber,
        key,
        original: originalLine
      });
    } else {
      // Direct usage like {t('key')}
      const newLine = originalLine.replace(
        new RegExp(`\\{t\\(['"\`]${key}['"\`]\\)\\}`, 'g'),
        `<I18nText translationKey="${key}" />`
      );
      
      if (newLine !== originalLine) {
        newContent[lineNumber] = newLine;
        directReplacements.push({
          lineNumber,
          key,
          original: originalLine,
          replacement: newLine
        });
        replacementCount++;
      }
    }
  });
});

// Write the updated content
fs.writeFileSync(filePath, newContent.join('\n'), 'utf-8');

console.log(`✅ Converted ${replacementCount} direct t() calls to I18nText components.`);

if (attributeReplacements.length > 0) {
  console.log(`\n⚠️ Found ${attributeReplacements.length} attribute usages that need manual conversion:`);
  attributeReplacements.forEach(attr => {
    console.log(`\nLine ${attr.lineNumber + 1}: ${attr.original.trim()}`);
    console.log(`Key: ${attr.key}`);
    console.log(`Suggested fix:`);
    console.log(`const ${attr.key.replace(/\./g, '_')} = t('${attr.key}');`);
    console.log(`// Then update the attribute to use this variable`);
  });
  
  console.log(`\nPlease update attribute usages manually.`);
}

if (replacementCount > 0 || attributeReplacements.length > 0) {
  console.log(`\n⚠️ Manual review is strongly recommended after conversion.`);
}

console.log(`\nNext steps:`);
console.log(`1. Review the changes in ${filePath}`);
console.log(`2. Manually handle any attribute usages`);
console.log(`3. Run the scanner again to check for any remaining issues:`);
console.log(`   node src/i18n/directUsageScanner.js ${filePath}`);
