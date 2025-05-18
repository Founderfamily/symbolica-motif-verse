
#!/usr/bin/env node

/**
 * Pre-commit Hook for Translation Usage
 * 
 * This script checks for direct t() function usage in staged files
 * and warns the developer about the preferred <I18nText> component approach.
 * 
 * Add to your .git/hooks/pre-commit or use husky to set up.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const checkI18nProgress = require('../scripts/check-i18n-progress.js');

// Get all staged files with .ts, .tsx, .js, .jsx extensions
const getStagedFiles = () => {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM').toString();
    return output
      .split('\n')
      .filter(file => /\.(tsx|ts|jsx|js)$/.test(file) && file.trim() !== '');
  } catch (error) {
    console.error('Error getting staged files:', error.message);
    return [];
  }
};

// Check if a file has direct t() usage
const checkFileForDirectUsage = (filePath) => {
  if (!fs.existsSync(filePath)) return { hasDirectUsage: false };
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const result = checkI18nProgress.scanFile(filePath);
    return { 
      hasDirectUsage: result.tUsageCount > 0,
      usageCount: result.tUsageCount,
      usageLines: result.tUsageLines 
    };
  } catch (error) {
    console.error(`Error checking file ${filePath}:`, error.message);
    return { hasDirectUsage: false };
  }
};

// Main function
const main = () => {
  const stagedFiles = getStagedFiles();
  let hasDirectUsage = false;
  const filesWithDirectUsage = [];
  
  stagedFiles.forEach(file => {
    const result = checkFileForDirectUsage(file);
    if (result.hasDirectUsage) {
      hasDirectUsage = true;
      filesWithDirectUsage.push({
        file,
        usageCount: result.usageCount,
        usageLines: result.usageLines
      });
    }
  });
  
  if (hasDirectUsage) {
    console.log('\n🚨 Warning: Direct t() usage detected in staged files!\n');
    console.log('The following files contain direct t() function calls:');
    
    filesWithDirectUsage.forEach(({ file, usageCount, usageLines }) => {
      console.log(`\n📄 ${file}: ${usageCount} instances`);
      
      // Show up to 3 examples
      const examples = usageLines.slice(0, 3);
      examples.forEach(line => {
        console.log(`   Line ${line.lineNumber}: ${line.content.substring(0, 80)}${line.content.length > 80 ? '...' : ''}`);
      });
      
      if (usageLines.length > 3) {
        console.log(`   ... and ${usageLines.length - 3} more instances`);
      }
    });
    
    console.log('\n⚠️  Consider using <I18nText> components instead of direct t() calls.');
    console.log('Run the following command to automatically convert them:');
    console.log('\n   npm run migrate-i18n\n');
    console.log('You can choose to continue with the commit, but direct t() usage is discouraged.\n');
    
    // Uncomment to make this hook block commits with t() usage
    // process.exit(1);
  }
  
  return { hasDirectUsage, filesWithDirectUsage };
};

// Run script if executed directly
if (require.main === module) {
  main();
}

module.exports = { main, getStagedFiles, checkFileForDirectUsage };
