
/**
 * Direct t() Usage Scanner
 * 
 * This utility scans the codebase for direct t() usage patterns that should be replaced with I18nText
 */

import fs from 'fs';
import path from 'path';
import glob from 'glob';

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
  /(?:placeholder|title|alt|aria-label)=\{t\(['"`](.+?)['"`]\)\}/g
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
  /useTranslation|TranslationValidator/
];

interface ScanResult {
  file: string;
  lines: Array<{
    lineNumber: number;
    content: string;
    suspectedKey?: string;
  }>;
}

export const scanDirectUsage = (rootDir: string = 'src'): ScanResult[] => {
  console.log(`🔍 Scanning for direct t() usage in ${rootDir}...`);
  
  const results: ScanResult[] = [];
  
  // Get all files with specified extensions
  const files = extensions.flatMap(ext => 
    glob.sync(`${rootDir}/**/*${ext}`, { nodir: true })
  );
  
  // Scan each file
  files.forEach(file => {
    try {
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

export const generateDirectUsageReport = (rootDir: string = 'src'): string => {
  const results = scanDirectUsage(rootDir);
  
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
  report += "placeholder={t('form.placeholder.email')} // TEMPORARILY until we have proper attribute handling\n";
  report += "```\n";
  
  return report;
};

// If this script is run directly (not imported)
if (require.main === module) {
  const rootDir = process.argv[2] || 'src';
  const report = generateDirectUsageReport(rootDir);
  console.log(report);
}

export default { scanDirectUsage, generateDirectUsageReport };
