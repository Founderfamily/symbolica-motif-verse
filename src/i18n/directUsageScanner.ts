
/**
 * Direct t() Usage Scanner
 * 
 * This utility scans the codebase for direct t() usage patterns that should be replaced with I18nText
 */

import fs from 'fs';
import path from 'path';
import * as glob from 'glob';

// File extensions to scan
const extensions = ['.tsx', '.jsx', '.ts', '.js'];

// Patterns that indicate direct t() usage
const directUsagePatterns = [
  // Common direct t() calls
  /\{t\(['"`](.+?)['"`]\)\}/g,
  /\{t\(['"`](.+?)['"`],/g,
  // Interpolated t() calls
  /<[^>]*>\s*\{t\(/g,
  // Direct assignment
  /=\s*t\(['"`](.+?)['"`]\)/g,
  // Direct usage in JSX attributes
  /(?:placeholder|title|alt|aria-label)=\{t\(['"`](.+?)['"`]\)\}/g,
  // Simple cases with curly braces
  /\{(?:\s*)t\(/g,
  // Direct assignment without spacing
  /=t\(/g,
  // Multiline usage
  /\{\s*t\s*\(\s*['"]/g,
  // More attribute patterns
  /\w+=\{t\(/g
];

// Patterns to exclude as valid usage
const validExceptions = [
  // Importing t
  /import.*\{.*t.*\}.*from/,
  // Using t in I18nText implementation
  /I18nText.+t\(/,
  // Comment lines
  /\/\/.*t\(/,
  // Inside translation utilities
  /useTranslation|TranslationValidator/,
  // Inside the scanner itself
  /directUsageScanner|pre-commit-hook|scanDirectUsage/,
  // Constants with t
  /const\s+t\s*=/
];

interface ScanResult {
  file: string;
  lines: Array<{
    lineNumber: number;
    content: string;
    suspectedKey?: string;
  }>;
}

export const scanDirectUsage = (rootDir: string = 'src', specificFiles?: string[]): ScanResult[] => {
  console.log(`🔍 Scanning for direct t() usage in ${specificFiles ? `${specificFiles.length} specific files` : rootDir}...`);
  
  const results: ScanResult[] = [];
  
  // Get files to scan
  const files = specificFiles || extensions.flatMap(ext => 
    glob.sync(`${rootDir}/**/*${ext}`, { nodir: true })
  );
  
  // Scan each file
  files.forEach(file => {
    try {
      if (!fs.existsSync(file)) {
        // Skip if file doesn't exist (might be due to path format differences)
        return;
      }
      
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');
      const fileMatches: ScanResult['lines'] = [];
      
      // Check each line
      lines.forEach((line, index) => {
        // Skip if line matches any exception
        if (validExceptions.some(pattern => pattern.test(line))) {
          return;
        }
        
        // Check for direct usage patterns
        for (const pattern of directUsagePatterns) {
          if (pattern.test(line)) {
            // Extract key if possible
            const keyMatch = line.match(/t\(['"`](.+?)['"`]\)/);
            const suspectedKey = keyMatch ? keyMatch[1] : undefined;
            
            fileMatches.push({
              lineNumber: index + 1,
              content: line.trim(),
              suspectedKey
            });
            break; // Found a match, no need to check other patterns
          }
        }
      });
      
      // Add to results if matches found
      if (fileMatches.length > 0) {
        results.push({
          file: file.replace(/\\/g, '/'),
          lines: fileMatches
        });
      }
    } catch (err) {
      console.error(`Error scanning file ${file}:`, err);
    }
  });
  
  return results;
};

export const generateDirectUsageReport = (rootDir: string = 'src', specificFiles?: string[]): string => {
  const results = scanDirectUsage(rootDir, specificFiles);
  
  if (results.length === 0) {
    return '✅ No direct t() usage detected. All translations use I18nText component.';
  }
  
  // Count total instances
  const totalInstances = results.reduce((sum, file) => sum + file.lines.length, 0);
  
  let report = `# Direct t() Usage Report\n\n`;
  report += `Found ${totalInstances} instances of direct t() usage across ${results.length} files.\n\n`;
  report += `These should be replaced with the I18nText component.\n\n`;
  
  results.forEach(file => {
    report += `## ${file.file}\n\n`;
    
    file.lines.forEach(line => {
      report += `- Line ${line.lineNumber}: \`${line.content}\`\n`;
      if (line.suspectedKey) {
        report += `  - Key: \`${line.suspectedKey}\`\n`;
      }
    });
    
    report += '\n';
  });
  
  report += `## How to Fix\n\n`;
  report += `Replace direct t() calls with the I18nText component:\n\n`;
  report += "```jsx\n";
  report += "// REPLACE THIS:\n";
  report += "{t('some.translation.key')}\n\n";
  report += "// WITH THIS:\n";
  report += "<I18nText translationKey=\"some.translation.key\" />\n";
  report += "```\n\n";
  
  report += `For attributes, use this pattern:\n\n`;
  report += "```jsx\n";
  report += "// REPLACE THIS:\n";
  report += "placeholder={t('form.placeholder.email')}\n\n";
  report += "// WITH THIS:\n";
  report += "const placeholderText = t('form.placeholder.email');\n";
  report += "...\n";
  report += "<input placeholder={placeholderText} />\n";
  report += "```\n";
  
  return report;
};

/**
 * Standalone function to scan a specific file for direct t() usage
 */
export const scanSingleFile = (filePath: string): ScanResult | null => {
  if (!fs.existsSync(filePath)) {
    console.error(`File does not exist: ${filePath}`);
    return null;
  }
  
  const results = scanDirectUsage('', [filePath]);
  return results.length > 0 ? results[0] : null;
};

/**
 * CLI command to check a file or directory
 */
export const runCLI = () => {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node directUsageScanner.js [file_or_directory]');
    process.exit(1);
  }
  
  const target = args[0];
  
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      const report = generateDirectUsageReport(target);
      console.log(report);
    } else {
      const result = scanSingleFile(target);
      if (result) {
        console.log(`Found ${result.lines.length} direct t() usage in ${target}:`);
        result.lines.forEach(line => {
          console.log(`Line ${line.lineNumber}: ${line.content}`);
        });
      } else {
        console.log(`✅ No direct t() usage found in ${target}`);
      }
    }
  } else {
    console.error(`Path does not exist: ${target}`);
    process.exit(1);
  }
};

// If this script is run directly (not imported)
if (require.main === module) {
  runCLI();
}

export default { scanDirectUsage, generateDirectUsageReport, scanSingleFile };
