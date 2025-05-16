
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

  // Only scan the staged files or their directories
  const results = scanDirectUsage('src');
  
  if (results.length > 0) {
    console.error('\n⚠️ Direct t() usage detected in your code!');
    console.error('Please use the <I18nText> component instead.\n');
    
    // Show the found issues
    results.forEach(file => {
      // Only report issues in staged files
      if (stagedFiles.some(stagedFile => file.file.includes(stagedFile))) {
        console.error(`File: ${file.file}`);
        file.lines.forEach(line => {
          console.error(`  Line ${line.lineNumber}: ${line.content}`);
        });
        console.error('');
      }
    });
    
    console.error('To fix:');
    console.error('- Replace {t("key")} with <I18nText translationKey="key" />');
    console.error('- For attributes, use a local constant: const placeholder = t("key")');
    console.error('\nYou can bypass this check with git commit --no-verify\n');
    
    process.exit(1); // Non-zero exit to abort commit
  }

  process.exit(0); // Everything is fine
} catch (error) {
  console.error('Error running pre-commit hook:', error);
  // Don't block the commit if the hook fails
  process.exit(0);
}
