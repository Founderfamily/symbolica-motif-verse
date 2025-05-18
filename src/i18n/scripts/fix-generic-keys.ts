
#!/usr/bin/env node

/**
 * Fix Generic Translation Keys
 * 
 * This script identifies and replaces generic translation keys with hierarchical ones
 * based on their location in the component hierarchy.
 * 
 * Usage: 
 *   npm run fix-generic-keys -- [--dry-run] [--verbose]
 * 
 * Options:
 *   --dry-run   Only show what would be changed without modifying files
 *   --verbose   Show detailed information about each change
 */

import fs from 'fs';
import path from 'path';
import glob from 'glob';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const isVerbose = args.includes('--verbose');
const mode = isDryRun ? 'DRY RUN' : 'UPDATE';

// Configuration
const GENERIC_KEYS = [
  'title', 'Title',
  'subtitle', 'Subtitle',
  'description', 'Description',
  'label', 'Label',
  'button', 'Button',
  'text', 'Text',
  'name', 'Name',
  'header', 'Header',
  'content', 'Content'
];

interface KeyOccurrence {
  file: string;
  line: number;
  key: string;
  context: string;
  suggestedKey: string;
  lineContent: string;
}

// Generate a better key based on file path and component context
function suggestBetterKey(key: string, filePath: string, lineContent: string, lineNumber: number): string {
  // Extract component name from file path
  const fileName = path.basename(filePath, path.extname(filePath));
  const fileContent = fs.readFileSync(filePath, 'utf8').split('\n');
  
  // Try to determine context from file structure
  const pathParts = filePath.split(path.sep);
  const isPagesDir = pathParts.includes('pages');
  const isComponentsDir = pathParts.includes('components');
  const isSectionsDir = pathParts.includes('sections');
  
  let namespace = 'common';
  let section = 'general';
  
  // Extract namespace from directory structure
  if (isPagesDir) {
    namespace = pathParts[pathParts.indexOf('pages') + 1] || 'pages';
    section = fileName.toLowerCase();
  } else if (isComponentsDir) {
    const componentType = pathParts[pathParts.indexOf('components') + 1];
    namespace = componentType || 'components';
    section = fileName.toLowerCase();
  } else if (isSectionsDir) {
    namespace = 'sections';
    section = fileName.toLowerCase();
  }
  
  // Try to extract component name from nearby context
  const startLine = Math.max(0, lineNumber - 10);
  const contextLines = fileContent.slice(startLine, lineNumber);
  
  // Look for React component or function declarations
  const componentMatches = contextLines.join('\n').match(
    /function\s+([A-Z][a-zA-Z0-9]*)|const\s+([A-Z][a-zA-Z0-9]*)\s*=/
  );
  
  if (componentMatches) {
    const componentName = componentMatches[1] || componentMatches[2];
    if (componentName) {
      section = componentName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }
  }
  
  // For UI element-specific context
  if (lineContent.includes('<Button') || lineContent.includes('button')) {
    key = 'button.' + key.toLowerCase();
  } else if (lineContent.includes('<h1') || lineContent.includes('<h2') || 
             lineContent.includes('title') || key.toLowerCase() === 'title') {
    key = 'title';
  } else if (lineContent.includes('subtitle') || key.toLowerCase() === 'subtitle') {
    key = 'subtitle';
  } else if (key.toLowerCase() === 'description') {
    key = 'description';
  }
  
  return `${namespace}.${section}.${key.toLowerCase()}`;
}

// Find all occurrences of generic keys
function findGenericKeys(): KeyOccurrence[] {
  console.log(`\n🔍 Scanning for generic translation keys... (${mode})`);
  
  const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { nodir: true });
  const results: KeyOccurrence[] = [];
  
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
          
          if (key && GENERIC_KEYS.includes(key)) {
            const suggestedKey = suggestBetterKey(key, file, line, lineIndex);
            
            results.push({
              file,
              line: lineIndex + 1,
              key,
              context: line.trim(),
              suggestedKey,
              lineContent: line
            });
          }
        }
      }
    });
  });
  
  return results;
}

// Replace generic keys in files
function replaceGenericKeys(occurrences: KeyOccurrence[]): void {
  if (isDryRun) {
    console.log('\n🔍 Changes that would be made:');
  } else {
    console.log('\n✏️ Making changes:');
  }
  
  // Group by file to process file-by-file
  const fileMap = new Map<string, KeyOccurrence[]>();
  
  occurrences.forEach(occurrence => {
    if (!fileMap.has(occurrence.file)) {
      fileMap.set(occurrence.file, []);
    }
    fileMap.get(occurrence.file)!.push(occurrence);
  });
  
  let totalChanges = 0;
  
  // Process each file
  fileMap.forEach((occurrences, file) => {
    let content = fs.readFileSync(file, 'utf-8');
    let fileChanges = 0;
    
    // Sort in reverse order to avoid position shifts
    occurrences.sort((a, b) => b.line - a.line);
    
    occurrences.forEach(occurrence => {
      const oldPattern = `translationKey="${occurrence.key}"`;
      const newPattern = `translationKey="${occurrence.suggestedKey}"`;
      
      if (content.includes(oldPattern)) {
        if (isVerbose) {
          console.log(`  ${file}:${occurrence.line}`);
          console.log(`    - ${oldPattern}`);
          console.log(`    + ${newPattern}`);
        }
        
        if (!isDryRun) {
          content = content.replace(oldPattern, newPattern);
        }
        
        fileChanges++;
        totalChanges++;
      }
    });
    
    if (!isDryRun && fileChanges > 0) {
      fs.writeFileSync(file, content, 'utf-8');
    }
    
    console.log(`  ${file}: ${fileChanges} changes${isDryRun ? ' would be made' : ' made'}`);
  });
  
  console.log(`\n${isDryRun ? 'Would change' : 'Changed'} ${totalChanges} generic keys in ${fileMap.size} files.`);
}

// Generate a CSV export of all generic keys
function generateCsv(occurrences: KeyOccurrence[]): void {
  const csvRows = [['File', 'Line', 'Original Key', 'Suggested Key', 'Context']];
  
  occurrences.forEach(occurrence => {
    csvRows.push([
      occurrence.file,
      occurrence.line.toString(),
      occurrence.key,
      occurrence.suggestedKey,
      occurrence.context.replace(/"/g, '""') // Escape quotes for CSV
    ]);
  });
  
  const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const outputFile = path.join(process.cwd(), 'generic-keys-report.csv');
  
  if (!isDryRun) {
    fs.writeFileSync(outputFile, csvContent, 'utf-8');
    console.log(`\n📊 CSV report generated: ${outputFile}`);
  } else {
    console.log('\n📊 CSV report would be generated (use without --dry-run to create file)');
  }
}

// Main function
function main(): void {
  console.log(`\n🔧 Fix Generic Translation Keys (${mode})`);
  console.log('=========================================');
  
  // Find all occurrences of generic keys
  const occurrences = findGenericKeys();
  
  if (occurrences.length === 0) {
    console.log('\n✅ Great job! No generic keys found.');
    return;
  }
  
  console.log(`\nFound ${occurrences.length} generic keys in ${new Set(occurrences.map(o => o.file)).size} files.`);
  
  // Replace generic keys
  replaceGenericKeys(occurrences);
  
  // Generate CSV report
  generateCsv(occurrences);
  
  if (isDryRun) {
    console.log('\n⚠️ This was a dry run. No files were modified.');
    console.log('Run without --dry-run to apply changes.');
  }
}

// Run the script
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

export { main, findGenericKeys };
