
#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// Configuration
const rootDir = path.resolve(__dirname, '../../');
const srcDir = path.join(rootDir, 'src');

// Generic keys to search for and replace
const genericKeys = ['Title', 'Description', 'Subtitle', 'Empty', 'NoResults'];

// File extensions to search
const fileExtensions = ['tsx', 'jsx', 'ts', 'js'];

// Translation component patterns
const translationPatterns = [
  /<I18nText\s+[^>]*translationKey=["']([^"']+)["'][^>]*>/g,
  /translationKey=["']([^"']+)["']/g,
  /t\(["']([^"']+)["']\)/g
];

/**
 * Find files with generic translation keys
 */
function findFilesWithGenericKeys(): string[] {
  const files: string[] = [];
  
  // Get all files with the specified extensions
  fileExtensions.forEach(ext => {
    const pattern = path.join(srcDir, `**/*.${ext}`);
    const matches = glob.sync(pattern);
    files.push(...matches);
  });
  
  // Filter files that contain generic keys
  return files.filter(file => {
    const content = fs.readFileSync(file, 'utf-8');
    return genericKeys.some(key => {
      return translationPatterns.some(pattern => {
        const regex = new RegExp(pattern.source.replace('([^"\']+)', `(${key})`), 'g');
        return regex.test(content);
      });
    });
  });
}

/**
 * Suggest a better key based on file path and component context
 */
function suggestBetterKey(file: string, genericKey: string): string {
  const relativePath = path.relative(srcDir, file);
  const componentPath = relativePath.replace(/\.[^/.]+$/, ''); // Remove extension
  const parts = componentPath.split(path.sep);
  
  // Use the path to construct a meaningful key
  // Example: src/components/sections/Hero.tsx -> sections.hero.title
  if (parts.length >= 2) {
    // Try to create a meaningful section name
    let section: string;
    if (parts.includes('sections')) {
      const sectionIndex = parts.indexOf('sections');
      if (sectionIndex < parts.length - 1) {
        section = parts[sectionIndex + 1].toLowerCase();
      } else {
        section = parts[parts.length - 1].toLowerCase();
      }
    } else if (parts.includes('components')) {
      const compIndex = parts.indexOf('components');
      if (compIndex < parts.length - 1) {
        section = parts[compIndex + 1].toLowerCase();
      } else {
        section = parts[parts.length - 1].toLowerCase();
      }
    } else {
      section = parts[parts.length - 1].toLowerCase();
    }
    
    return `${section}.${genericKey.toLowerCase()}`;
  }
  
  // Fallback
  return `common.${genericKey.toLowerCase()}`;
}

/**
 * Replace generic keys in files with suggested better keys
 */
function replaceGenericKeys(files: string[], dryRun: boolean = true): Map<string, string[]> {
  const replacements = new Map<string, string[]>();
  
  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');
    const fileReplacements: string[] = [];
    
    // Check each generic key pattern
    genericKeys.forEach(genericKey => {
      translationPatterns.forEach(pattern => {
        const regex = new RegExp(pattern.source.replace('([^"\']+)', `(${genericKey})`), 'g');
        
        // Find matches
        let match;
        while ((match = regex.exec(content)) !== null) {
          const fullMatch = match[0];
          const matchedKey = match[1];
          
          if (matchedKey === genericKey) {
            // Suggest better key
            const betterKey = suggestBetterKey(file, genericKey);
            
            // Replace in content if not a dry run
            if (!dryRun) {
              const replacement = fullMatch.replace(genericKey, betterKey);
              content = content.replace(fullMatch, replacement);
            }
            
            fileReplacements.push(`${genericKey} -> ${betterKey}`);
          }
        }
      });
    });
    
    // Save changes if not a dry run and there were replacements
    if (!dryRun && fileReplacements.length > 0) {
      fs.writeFileSync(file, content, 'utf-8');
    }
    
    if (fileReplacements.length > 0) {
      replacements.set(file, fileReplacements);
    }
  });
  
  return replacements;
}

/**
 * Main execution
 */
function main() {
  console.log('Scanning for files with generic translation keys...');
  const files = findFilesWithGenericKeys();
  
  if (files.length === 0) {
    console.log('No files found with generic keys.');
    return;
  }
  
  console.log(`Found ${files.length} files with generic keys.`);
  
  // Check for --fix flag
  const fixMode = process.argv.includes('--fix');
  
  const replacements = replaceGenericKeys(files, !fixMode);
  
  // Print report
  console.log('\nREPORT:');
  console.log('-------');
  
  if (replacements.size === 0) {
    console.log('No replacements needed or found.');
  } else {
    replacements.forEach((reps, file) => {
      console.log(`\nFile: ${path.relative(rootDir, file)}`);
      reps.forEach(rep => console.log(`- ${rep}`));
    });
    
    if (fixMode) {
      console.log('\nChanges have been applied to files.');
    } else {
      console.log('\nThis was a dry run. Use --fix flag to apply changes.');
    }
  }
}

// Run the script
main();
