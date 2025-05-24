
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node simple-converter.js <file_path>');
  process.exit(1);
}

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');
let newContent = content;

// Add I18nText import if needed and file contains t() calls
if (content.includes('t(') && !content.includes('I18nText')) {
  const lines = content.split('\n');
  const lastImportIndex = lines.findIndex(line => line.trim().startsWith('import ')) + 1;
  
  if (lastImportIndex > 0) {
    lines.splice(lastImportIndex, 0, `import { I18nText } from '@/components/ui/i18n-text';`);
    newContent = lines.join('\n');
  }
}

// Simple replacements for common patterns
const replacements = [
  // {t('key')} -> <I18nText translationKey="key" />
  {
    pattern: /\{t\(['"`]([^'"`]+?)['"`]\)\}/g,
    replacement: '<I18nText translationKey="$1" />'
  },
  // {t("key")} -> <I18nText translationKey="key" />
  {
    pattern: /\{t\(['"`]([^'"`]+?)['"`]\)\}/g,
    replacement: '<I18nText translationKey="$1" />'
  }
];

let changeCount = 0;
replacements.forEach(({ pattern, replacement }) => {
  const matches = newContent.match(pattern);
  if (matches) {
    changeCount += matches.length;
    newContent = newContent.replace(pattern, replacement);
  }
});

if (changeCount > 0) {
  fs.writeFileSync(filePath, newContent);
  console.log(`✅ Converted ${changeCount} t() calls in ${filePath}`);
} else {
  console.log(`ℹ️ No t() calls found in ${filePath}`);
}
