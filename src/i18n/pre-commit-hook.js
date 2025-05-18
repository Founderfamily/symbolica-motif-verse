
#!/usr/bin/env node

/**
 * Pre-commit hook to detect direct t() usage
 * 
 * To install:
 * 1. Make this file executable: chmod +x src/i18n/pre-commit-hook.js
 * 2. Link it as a git hook: ln -sf ../../src/i18n/pre-commit-hook.js .git/hooks/pre-commit
 */

const { execSync } = require('child_process');
const { scanDirectUsage } = require('./directUsageScanner');

// Only check files that are staged for commit
try {
  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR')
    .toString()
    .trim()
    .split('\n')
    .filter(file => /\.(tsx?|jsx?)$/.test(file));

  if (stagedFiles.length === 0) {
    process.exit(0); // No relevant files staged
  }

  console.log('\n🔍 Checking for direct t() usage in staged files...');
  
  // Only scan the staged files
  const results = scanDirectUsage('src', stagedFiles);
  
  if (results.length > 0) {
    console.error('\n⚠️ Direct t() usage detected in your code!');
    console.error('Please use the <I18nText> component instead.\n');
    
    // Count total instances
    const totalInstances = results.reduce((sum, file) => sum + file.lines.length, 0);
    console.error(`Found ${totalInstances} instances across ${results.length} files:\n`);
    
    // Show the found issues
    results.forEach(file => {
      console.error(`File: ${file.file}`);
      file.lines.forEach(line => {
        console.error(`  Line ${line.lineNumber}: ${line.content}`);
      });
      console.error('');
    });
    
    console.error('To fix:');
    console.error('1. Replace {t("key")} with <I18nText translationKey="key" />');
    console.error('2. For attributes, use a local constant: const placeholder = t("key")');
    console.error('3. Use the helper script: node src/i18n/convert-t-to-i18ntext.js path/to/file.tsx');
    console.error('\nYou can bypass this check with git commit --no-verify\n');
    
    process.exit(1); // Non-zero exit to abort commit
  }

  console.log('✅ No direct t() usage detected in staged files.\n');
  process.exit(0); // Everything is fine
} catch (error) {
  console.error('Error running pre-commit hook:', error);
  // Don't block the commit if the hook fails
  process.exit(0);
}
