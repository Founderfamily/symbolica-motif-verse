
#!/usr/bin/env node

/**
 * Scan All Files for Translation Issues
 * 
 * This script scans all components for:
 * 1. Direct t() usage
 * 2. Missing translation keys
 * 3. Format inconsistencies
 * 
 * Usage:
 *   node scan-all.js [--fix] [--report=filename.md]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const reportArg = args.find(arg => arg.startsWith('--report='));
const reportFile = reportArg ? reportArg.split('=')[1] : null;

console.log('🔍 Scanning project files for translation issues...');

// Configuration
const config = {
  sourceDir: 'src',
  componentPatterns: [
    'src/components/**/*.tsx',
    'src/pages/**/*.tsx',
    'src/App.tsx'
  ],
  ignorePatterns: [
    '**/node_modules/**',
    '**/__tests__/**',
    '**/ui/**' // Ignore shadcn components
  ]
};

// Find all component files
const findComponentFiles = () => {
  let allFiles = [];
  config.componentPatterns.forEach(pattern => {
    const files = glob.sync(pattern, { ignore: config.ignorePatterns });
    allFiles = [...allFiles, ...files];
  });
  return allFiles;
};

const componentFiles = findComponentFiles();
console.log(`Found ${componentFiles.length} component files to scan`);

// Scan for direct t() usage
const scanForDirectTUsage = (files) => {
  try {
    // Create a temp file with all the files to scan
    const tempFilePath = path.join(__dirname, 'temp_files_to_scan.txt');
    fs.writeFileSync(tempFilePath, files.join('\n'));
    
    const command = `node -r ts-node/register ${path.join(__dirname, '../directUsageScanner.ts')} --files-from=${tempFilePath}`;
    const output = execSync(command, { encoding: 'utf-8' });
    
    // Cleanup temp file
    fs.unlinkSync(tempFilePath);
    
    return output;
  } catch (error) {
    console.error('Error scanning for direct t() usage:', error.message);
    return 'Error scanning files';
  }
};

// Run the scan
const scanOutput = scanForDirectTUsage(componentFiles);
console.log('\n=== Direct t() Usage Scan Results ===');
console.log(scanOutput);

// Generate report if requested
if (reportFile) {
  console.log(`\nGenerating report to ${reportFile}...`);
  
  const report = `# Translation Scan Report
  
## Direct t() Usage

${scanOutput}

## Recommendations

1. Replace direct t() usage with I18nText components
2. Add missing translations for all hardcoded text
3. Use proper key format: namespace.section.element[.qualifier]
4. Run validation before committing changes

## Automation Tools

Use these tools to fix issues:
- \`node src/i18n/scripts/convert-file.js <file>\` - Convert a file to use I18nText
- \`node src/i18n/scripts/run-all-fixes.js --auto-fix\` - Attempt to fix all issues
`;

  fs.writeFileSync(reportFile, report);
  console.log(`Report saved to ${reportFile}`);
}

// Auto-fix if requested
if (shouldFix) {
  console.log('\n🔧 Attempting to fix issues...');
  
  // Extract files with issues from scan output
  const filesWithIssues = [];
  const lines = scanOutput.split('\n');
  
  lines.forEach(line => {
    const match = line.match(/- ([^:]+):/);
    if (match) {
      filesWithIssues.push(match[1]);
    }
  });
  
  if (filesWithIssues.length > 0) {
    console.log(`Found ${filesWithIssues.length} files to fix`);
    
    filesWithIssues.forEach(file => {
      try {
        console.log(`Processing ${file}...`);
        execSync(`node ${path.join(__dirname, 'convert-file.js')} ${file}`, { encoding: 'utf-8' });
      } catch (error) {
        console.error(`Error processing ${file}:`, error.message);
      }
    });
    
    console.log('✅ Finished processing files');
  } else {
    console.log('No files to fix');
  }
} else {
  console.log('\nRun with --fix to attempt automatic fixes');
}

console.log('\n✅ Scan completed');
