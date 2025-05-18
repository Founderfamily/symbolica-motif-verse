#!/usr/bin/env node

/**
 * Translation Migration Tool
 * 
 * This script converts t() function calls to <I18nText> component usage
 * throughout the codebase.
 * 
 * Usage:
 *   node convert-t-to-i18ntext.js [directory]
 * 
 * Example:
 *   node convert-t-to-i18ntext.js src/components
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// File extensions to process
const extensions = ['.tsx', '.jsx', '.ts', '.js'];

// Target directory to process (default to src)
const targetDir = process.argv[2] || 'src';

// Regular expressions for different t() patterns
const patterns = [
  // {t('key')} pattern
  {
    regex: /\{t\(\s*['"`](.+?)['"`]\s*\)\}/g,
    replacement: '<I18nText translationKey="$1" />',
    type: 'JSX content'
  },
  // {t('key', { count })} pattern with params
  {
    regex: /\{t\(\s*['"`](.+?)['"`]\s*,\s*(\{[^}]+\})\s*\)\}/g,
    replacement: '<I18nText translationKey="$1" values={$2} />',
    type: 'JSX content with params'
  },
  // prop={t('key')} pattern
  {
    regex: /(\w+)=\{t\(\s*['"`](.+?)['"`]\s*\)\}/g,
    replacement: (match, prop, key) => {
      // Special case for certain props that we want to keep as attributes
      const specialProps = ['placeholder', 'title', 'alt', 'aria-label'];
      if (specialProps.includes(prop)) {
        return `${prop}={t('${key}')}`;
      }
      return `${prop}={<I18nText translationKey="${key}" />}`;
    },
    type: 'JSX property'
  },
  // var = t('key') pattern
  {
    regex: /(const|let|var)\s+(\w+)\s*=\s*t\(\s*['"`](.+?)['"`]\s*\)/g,
    replacement: '$1 $2 = <I18nText translationKey="$3" />',
    type: 'Variable assignment'
  }
];

// Check if a file has I18nText import
const hasI18nTextImport = (content) => {
  return /import.*I18nText.*from/i.test(content);
};

// Add I18nText import if needed
const addI18nTextImport = (content) => {
  // Skip if already imported
  if (hasI18nTextImport(content)) {
    return content;
  }
  
  // Find existing import statements
  const importRegex = /import\s+.*\s+from\s+['"].*['"]/;
  const lastImportMatch = [...content.matchAll(importRegex)].pop();
  
  if (lastImportMatch) {
    const lastImport = lastImportMatch[0];
    const lastImportIndex = content.indexOf(lastImport) + lastImport.length;
    const beforeImports = content.substring(0, lastImportIndex);
    const afterImports = content.substring(lastImportIndex);
    
    return beforeImports + '\nimport { I18nText } from \'@/components/ui/i18n-text\';' + afterImports;
  }
  
  // If no imports found, add it at the beginning
  return 'import { I18nText } from \'@/components/ui/i18n-text\';\n\n' + content;
};

// Skip files containing these patterns
const skipPatterns = [
  /i18n-text\.tsx/,           // Skip the I18nText component itself
  /TranslationProvider\.tsx/, // Skip translation provider
  /useTranslation/,           // Skip translation hooks
  /convert-t-to-i18ntext/     // Skip this script itself
];

// Check if a file should be skipped
const shouldSkipFile = (filePath) => {
  return skipPatterns.some(pattern => pattern.test(filePath));
};

// Process a single file
const processFile = (filePath) => {
  if (shouldSkipFile(filePath)) {
    console.log(`⏭️  Skipping: ${filePath}`);
    return { processed: false };
  }

  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let replacementCount = 0;

    // Apply each pattern
    for (const pattern of patterns) {
      const matches = content.match(pattern.regex);
      if (matches) {
        replacementCount += matches.length;
        
        if (typeof pattern.replacement === 'function') {
          content = content.replace(pattern.regex, pattern.replacement);
        } else {
          content = content.replace(pattern.regex, pattern.replacement);
        }
      }
    }

    // If we made replacements, add the import if needed
    if (replacementCount > 0) {
      content = addI18nTextImport(content);
      
      // Write changes back to file
      fs.writeFileSync(filePath, content, 'utf-8');
      
      return { 
        processed: true, 
        replacements: replacementCount, 
        fileContent: content,
        originalContent
      };
    }

    return { processed: false };
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return { processed: false, error: error.message };
  }
};

// Find all files to process
const findFiles = () => {
  return extensions.flatMap(ext => 
    glob.sync(`${targetDir}/**/*${ext}`, { nodir: true })
  );
};

// Main function
const main = () => {
  console.log(`\n🔄 Converting t() calls to <I18nText> in ${targetDir}/**/*{ts,tsx,js,jsx}...\n`);

  const files = findFiles();
  let totalReplacements = 0;
  let filesProcessed = 0;
  const processedFiles = [];
  
  files.forEach(filePath => {
    const result = processFile(filePath);
    if (result.processed) {
      filesProcessed++;
      totalReplacements += result.replacements;
      processedFiles.push({
        path: filePath,
        replacements: result.replacements
      });
      console.log(`✅ ${filePath}: ${result.replacements} replacements`);
    }
  });
  
  console.log(`\n✨ Done! Processed ${filesProcessed} files with ${totalReplacements} total replacements.\n`);
  
  // Create a backup report
  if (processedFiles.length > 0) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const report = {
      timestamp,
      processedFiles
    };
    
    const backupDir = path.join(process.cwd(), 'src', 'i18n', 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const reportPath = path.join(backupDir, `migration-report-${timestamp}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Migration report saved to: ${reportPath}`);
  }
  
  return { filesProcessed, totalReplacements, processedFiles };
};

// Run script if executed directly
if (require.main === module) {
  main();
}

module.exports = { processFile, findFiles, main };
