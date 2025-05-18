
#!/usr/bin/env node

/**
 * Generic Translation Key Finder
 * 
 * This script identifies generic translation keys like "Title", "Subtitle" that
 * should be replaced with more specific hierarchical keys.
 * 
 * Usage:
 *   node find-generic-keys.js [--detail]
 * 
 * Options:
 *   --detail   Show detailed information about each occurrence
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Parse arguments
const args = process.argv.slice(2);
const showDetail = args.includes('--detail');

// Generic keys to look for
const genericKeys = [
  'title',
  'Title',
  'subtitle',
  'Subtitle',
  'description',
  'Description',
  'label',
  'Label',
  'button',
  'Button',
  'text',
  'Text',
  'name',
  'Name',
  'header',
  'Header',
  'content',
  'Content',
  'placeholder',
  'Placeholder',
  'error',
  'Error',
  'message',
  'Message',
  'submit',
  'Submit',
  'cancel',
  'Cancel',
  'save',
  'Save',
  'delete',
  'Delete'
];

// Find all occurrences of translationKey="..." with generic keys
const findGenericKeyUsage = () => {
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { nodir: true });
  const results = [];
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineIndex) => {
      // Check for translationKey="..." pattern
      const matches = line.match(/translationKey=["']([^"']+)["']/g);
      
      if (matches) {
        for (const match of matches) {
          // Extract the key value
          const keyMatch = match.match(/translationKey=["']([^"']+)["']/);
          const key = keyMatch ? keyMatch[1] : null;
          
          if (key && genericKeys.some(genericKey => {
            // Check exact match or if it's a short key without hierarchy
            return key === genericKey || (key.indexOf('.') === -1 && key.toLowerCase() === genericKey.toLowerCase());
          })) {
            results.push({
              file,
              line: lineIndex + 1, // 1-based line number
              key,
              content: line.trim(),
              context: {
                before: lines[lineIndex - 1]?.trim() || '',
                current: line.trim(),
                after: lines[lineIndex + 1]?.trim() || ''
              }
            });
          }
        }
      }
    });
  });
  
  return results;
};

// Suggest better keys based on file path and component context
const suggestBetterKey = (occurrence) => {
  const { file, key, context } = occurrence;
  
  // Extract component name from file path
  const fileMatch = file.match(/\/([^\/]+)\.[jt]sx?$/);
  const componentName = fileMatch ? fileMatch[1].replace(/[A-Z]/g, letter => letter.toLowerCase()) : '';
  
  // Determine section from file path
  let section = '';
  if (file.includes('/components/')) {
    section = file.split('/components/')[1].split('/')[0].toLowerCase();
  } else if (file.includes('/pages/')) {
    section = file.split('/pages/')[1].split('/')[0].toLowerCase();
  } else if (file.includes('/sections/')) {
    section = file.split('/sections/')[1].split('/')[0].toLowerCase();
  }
  
  // Look for parent component in context
  const componentMatch = context.before.match(/function\s+([A-Za-z0-9_]+)/);
  const parentComponent = componentMatch 
    ? componentMatch[1].replace(/[A-Z]/g, letter => `.${letter.toLowerCase()}`).substring(1) 
    : '';
  
  // Build suggested key
  let suggestion = '';
  
  if (section && componentName) {
    suggestion = `${section}.${componentName}.${key.toLowerCase()}`;
  } else if (parentComponent) {
    suggestion = `components.${parentComponent}.${key.toLowerCase()}`;
  } else if (componentName) {
    suggestion = `components.${componentName}.${key.toLowerCase()}`;
  } else {
    suggestion = `ui.${key.toLowerCase()}`;
  }
  
  return suggestion;
};

// Generate fix code
const generateFixCode = (occurrence, suggestion) => {
  const { content, key } = occurrence;
  
  return content.replace(
    `translationKey="${key}"`, 
    `translationKey="${suggestion}"`
  );
};

// Main function
const main = () => {
  console.log('🔍 Scanning for generic translation keys...');
  
  const occurrences = findGenericKeyUsage();
  
  console.log(`\nFound ${occurrences.length} generic translation keys.`);
  
  if (occurrences.length === 0) {
    console.log('Great job! No generic keys found.');
    return { success: true, count: 0 };
  }
  
  // Group by file
  const fileGroups = {};
  occurrences.forEach(occurrence => {
    if (!fileGroups[occurrence.file]) {
      fileGroups[occurrence.file] = [];
    }
    fileGroups[occurrence.file].push(occurrence);
  });
  
  // Print results
  console.log('\n📄 Generic keys by file:');
  Object.keys(fileGroups).forEach(file => {
    const shortPath = file.replace(process.cwd(), '');
    console.log(`\n${shortPath} (${fileGroups[file].length} keys):`);
    
    fileGroups[file].forEach(occurrence => {
      const suggestion = suggestBetterKey(occurrence);
      console.log(`- Line ${occurrence.line}: "${occurrence.key}" → "${suggestion}"`);
      
      if (showDetail) {
        console.log(`  Current: ${occurrence.context.current}`);
        console.log(`  Suggested: ${generateFixCode(occurrence, suggestion)}\n`);
      }
    });
  });
  
  // Generate report file
  const reportContent = `
# Generic Translation Keys Report

Generated on: ${new Date().toLocaleString()}

## Summary
- Found ${occurrences.length} generic translation keys across ${Object.keys(fileGroups).length} files

## Recommendations

${Object.keys(fileGroups).map(file => {
  const shortPath = file.replace(process.cwd(), '');
  return `### ${shortPath} (${fileGroups[file].length} keys)

${fileGroups[file].map(occurrence => {
  const suggestion = suggestBetterKey(occurrence);
  return `- Line ${occurrence.line}: \`${occurrence.key}\` → \`${suggestion}\`
  - Current: \`${occurrence.context.current}\`
  - Suggested: \`${generateFixCode(occurrence, suggestion)}\`
`;
}).join('\n')}
`;
}).join('\n')}

## Next Steps

1. Replace generic keys with more specific, hierarchical keys
2. Update translation files with new key structure
3. Re-run this tool to verify all generic keys have been replaced
`;
  
  fs.writeFileSync('generic-keys-report.md', reportContent);
  console.log('\n✅ Generated report at: generic-keys-report.md');
  
  console.log('\n🔧 How to fix:');
  console.log('1. Replace generic keys with specific hierarchical keys like:');
  console.log('   "page.section.component.purpose"');
  console.log('2. Update your translation files with the new keys');
  console.log('3. Run the missing keys generator to ensure all keys are defined:');
  console.log('   node src/i18n/scripts/i18n-generate-missing.js');
  
  return { success: true, count: occurrences.length };
};

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main, findGenericKeyUsage };
