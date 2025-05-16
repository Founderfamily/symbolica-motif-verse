
#!/usr/bin/env node

/**
 * Find Direct t() Usage Script
 * 
 * This utility helps developers find and fix direct t() usage in their components.
 * It can scan entire directories or specific files and provides a helpful report.
 * 
 * Usage:
 *   node find-direct-t-usage.js [directory|file] [--interactive]
 * 
 * Examples:
 *   node find-direct-t-usage.js src/components
 *   node find-direct-t-usage.js src/pages/Home.tsx --interactive
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

// Parse command line arguments
const args = process.argv.slice(2);
const target = args.length > 0 && !args[0].startsWith('--') ? args[0] : 'src';
const isInteractive = args.includes('--interactive');

// Check if the scanner is available
const scannerPath = path.resolve(__dirname, '../directUsageScanner.ts');
if (!fs.existsSync(scannerPath)) {
  console.error('❌ Scanner not found at:', scannerPath);
  process.exit(1);
}

// Check if the converter is available
const converterPath = path.resolve(__dirname, '../convert-t-to-i18ntext.js');
if (!fs.existsSync(converterPath)) {
  console.error('❌ Converter not found at:', converterPath);
  process.exit(1);
}

// Function to run the scanner
const runScanner = (targetPath) => {
  try {
    const command = `node -r ts-node/register ${scannerPath} ${targetPath}`;
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error('❌ Error running scanner:', error.message);
    return null;
  }
};

// Function to run the converter
const runConverter = (filePath) => {
  try {
    const command = `node ${converterPath} ${filePath}`;
    return execSync(command, { encoding: 'utf8' });
  } catch (error) {
    console.error('❌ Error running converter:', error.message);
    return null;
  }
};

// Main function
const main = () => {
  console.log(`🔍 Scanning ${target} for direct t() usage...`);
  
  // Run the scanner
  const scanOutput = runScanner(target);
  
  if (!scanOutput) {
    console.error('❌ Scan failed');
    process.exit(1);
  }
  
  // Extract the number of files with issues
  const fileCountMatch = scanOutput.match(/Found \d+ instances of direct t\(\) usage across (\d+) files/);
  const fileCount = fileCountMatch ? parseInt(fileCountMatch[1], 10) : 0;
  
  // Extract the files with issues
  const filesWithIssues = [];
  let currentFile = null;
  
  for (const line of scanOutput.split('\n')) {
    const fileMatch = line.match(/- ([^:]+): \d+ instances/);
    if (fileMatch) {
      currentFile = fileMatch[1];
      filesWithIssues.push(currentFile);
    }
  }
  
  // Print summary
  console.log(scanOutput);
  
  // Interactive mode
  if (isInteractive && filesWithIssues.length > 0) {
    console.log('\n📝 Interactive Mode: You can convert files one by one');
    
    // In a real environment, you'd use a library like inquirer
    // Here we're using a simple approach for demonstration
    console.log('\nFiles with direct t() usage:');
    
    filesWithIssues.forEach((file, index) => {
      console.log(`${index + 1}. ${file}`);
    });
    
    console.log('\nTo convert a file, run:');
    console.log(`node ${converterPath} <file_path>`);
    
    console.log('\nFor example:');
    if (filesWithIssues.length > 0) {
      console.log(`node ${converterPath} ${filesWithIssues[0]}`);
    }
  }
  
  // Return exit code based on findings
  return filesWithIssues.length > 0 ? 1 : 0;
};

// Run the script
const exitCode = main();
if (!module.parent) {
  process.exit(exitCode);
}
