
#!/usr/bin/env node

/**
 * Translation Migration Progress Checker
 * 
 * This script scans the project for remaining t() function usage
 * and reports files that need migration to I18nText component.
 * 
 * Usage:
 *   node check-i18n-progress.js [directory]
 * 
 * Example:
 *   node check-i18n-progress.js src/components
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  dim: '\x1b[2m',
};

// File extensions to scan
const extensions = ['.tsx', '.jsx', '.ts', '.js'];

// Patterns that indicate direct t() usage
const directUsagePatterns = [
  // Various t() function patterns
  /\{t\(['"`](.+?)['"`]\)\}/g,
  /\{t\(['"`](.+?)['"`],/g,
  /=\s*t\(['"`](.+?)['"`]\)/g,
  /(?:placeholder|title|alt|aria-label)=\{t\(['"`](.+?)['"`]\)\}/g,
  /\{\s*t\s*\(\s*['"]/g,
  /=t\(/g,
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
  /directUsageScanner|pre-commit-hook|scanDirectUsage|check-i18n-progress/,
  // Constants with t
  /const\s+t\s*=/
];

// Patterns that indicate I18nText usage
const i18nTextUsagePattern = /<I18nText\s+/g;

// Target directory to scan (default to src)
const targetDir = process.argv[2] || 'src';

// Scan a file for direct t() usage and I18nText usage
const scanFile = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let tUsageCount = 0;
  let i18nTextUsageCount = 0;
  const tUsageLines = [];

  // Check each line
  lines.forEach((line, index) => {
    // Skip if line matches any exception
    if (validExceptions.some(pattern => pattern.test(line))) {
      return;
    }

    // Count I18nText usages
    const i18nMatches = line.match(i18nTextUsagePattern);
    if (i18nMatches) {
      i18nTextUsageCount += i18nMatches.length;
    }

    // Check for direct usage patterns
    for (const pattern of directUsagePatterns) {
      const matches = line.match(pattern);
      if (matches) {
        tUsageCount += matches.length;
        tUsageLines.push({
          lineNumber: index + 1,
          content: line.trim()
        });
        break; // Found a match, no need to check other patterns
      }
    }
  });

  return {
    filePath,
    tUsageCount,
    i18nTextUsageCount,
    tUsageLines,
    totalUsages: tUsageCount + i18nTextUsageCount,
    migrationRatio: tUsageCount > 0 ? i18nTextUsageCount / (tUsageCount + i18nTextUsageCount) : 1
  };
};

// Get all project files that might contain translations
const findFiles = () => {
  return extensions.flatMap(ext => 
    glob.sync(`${targetDir}/**/*${ext}`, { nodir: true })
  );
};

// Main function
const main = () => {
  console.log(`\n${colors.cyan}📊 Translation Migration Progress Report${colors.reset}`);
  console.log(`${colors.gray}Scanning ${targetDir} for t() and I18nText usage...${colors.reset}\n`);

  const files = findFiles();
  const results = [];

  // Scan each file
  files.forEach(filePath => {
    try {
      const result = scanFile(filePath);
      if (result.totalUsages > 0) {
        results.push(result);
      }
    } catch (error) {
      console.error(`Error scanning ${filePath}:`, error.message);
    }
  });

  // Sort files: not migrated first, then partially migrated, then fully migrated
  results.sort((a, b) => {
    if (a.migrationRatio !== b.migrationRatio) {
      return a.migrationRatio - b.migrationRatio;
    }
    return b.totalUsages - a.totalUsages;
  });

  // Group results
  const notMigrated = results.filter(r => r.migrationRatio === 0);
  const partiallyMigrated = results.filter(r => r.migrationRatio > 0 && r.migrationRatio < 1);
  const fullyMigrated = results.filter(r => r.migrationRatio === 1 && r.totalUsages > 0);

  // Calculate statistics
  const totalFiles = results.length;
  const migratedFiles = fullyMigrated.length;
  const migrationPercentage = totalFiles > 0 ? (migratedFiles / totalFiles * 100).toFixed(1) : 0;
  const totalTUsage = results.reduce((sum, r) => sum + r.tUsageCount, 0);
  const totalI18nUsage = results.reduce((sum, r) => sum + r.i18nTextUsageCount, 0);
  const overallMigrationRatio = totalTUsage + totalI18nUsage > 0 
    ? (totalI18nUsage / (totalTUsage + totalI18nUsage) * 100).toFixed(1)
    : 0;

  // Print summary
  console.log(`${colors.cyan}Summary:${colors.reset}`);
  console.log(`${colors.gray}Files with translations: ${colors.reset}${totalFiles}`);
  console.log(`${colors.green}✅ Fully migrated: ${colors.reset}${migratedFiles} (${migrationPercentage}%)`);
  console.log(`${colors.yellow}⚠️ Partially migrated: ${colors.reset}${partiallyMigrated.length}`);
  console.log(`${colors.red}❌ Not migrated: ${colors.reset}${notMigrated.length}`);
  console.log(`${colors.gray}Total migration ratio: ${colors.reset}${overallMigrationRatio}% \n`);

  // Print not migrated files
  if (notMigrated.length > 0) {
    console.log(`${colors.red}❌ Files not migrated:${colors.reset}`);
    notMigrated.forEach(file => {
      const relativePath = path.relative(process.cwd(), file.filePath);
      console.log(`  ${colors.red}[ ]${colors.reset} ${relativePath} — ${file.tUsageCount} t() instances`);
    });
    console.log();
  }

  // Print partially migrated files
  if (partiallyMigrated.length > 0) {
    console.log(`${colors.yellow}⚠️ Files partially migrated:${colors.reset}`);
    partiallyMigrated.forEach(file => {
      const relativePath = path.relative(process.cwd(), file.filePath);
      const percentage = (file.migrationRatio * 100).toFixed(0);
      console.log(`  ${colors.yellow}[${percentage}%]${colors.reset} ${relativePath} — ${file.tUsageCount} t() and ${file.i18nTextUsageCount} I18nText`);

      // Print a few examples of lines that need migration
      const maxExamples = 2;
      if (file.tUsageLines.length > 0) {
        console.log(`    ${colors.dim}Examples of t() usage:${colors.reset}`);
        file.tUsageLines.slice(0, maxExamples).forEach(line => {
          console.log(`    ${colors.dim}Line ${line.lineNumber}: ${line.content.substring(0, 80)}${line.content.length > 80 ? '...' : ''}${colors.reset}`);
        });
        if (file.tUsageLines.length > maxExamples) {
          console.log(`    ${colors.dim}... and ${file.tUsageLines.length - maxExamples} more${colors.reset}`);
        }
      }
    });
    console.log();
  }

  // Print fully migrated files
  if (fullyMigrated.length > 0) {
    console.log(`${colors.green}✅ Files fully migrated:${colors.reset}`);
    fullyMigrated.forEach(file => {
      const relativePath = path.relative(process.cwd(), file.filePath);
      console.log(`  ${colors.green}[✓]${colors.reset} ${relativePath} — ${file.i18nTextUsageCount} I18nText components`);
    });
    console.log();
  }

  return {
    totalFiles,
    migratedFiles,
    partiallyMigrated: partiallyMigrated.length,
    notMigrated: notMigrated.length,
    migrationPercentage
  };
};

// Run script if executed directly
if (require.main === module) {
  const results = main();
  
  // Exit with success (0) if migration is complete, otherwise exit with 1
  process.exit(results.notMigrated === 0 && results.partiallyMigrated === 0 ? 0 : 1);
}

module.exports = {
  scanFile,
  findFiles,
  main
};
