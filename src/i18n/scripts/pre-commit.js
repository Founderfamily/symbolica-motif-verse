
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Get staged files
  const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACMR')
    .toString()
    .trim()
    .split('\n')
    .filter(file => /\.(tsx?|jsx?)$/.test(file) && fs.existsSync(file));

  if (stagedFiles.length === 0) {
    process.exit(0);
  }

  console.log('🔍 Checking for direct t() usage...');
  
  let hasDirectUsage = false;
  
  for (const file of stagedFiles) {
    const content = fs.readFileSync(file, 'utf-8');
    const matches = content.match(/\{t\(['"`][^'"`]+['"`]\)\}/g);
    
    if (matches) {
      console.log(`❌ Found direct t() usage in ${file}:`);
      matches.forEach(match => console.log(`   ${match}`));
      hasDirectUsage = true;
    }
  }
  
  if (hasDirectUsage) {
    console.log('\n💡 Please use <I18nText translationKey="..." /> instead');
    console.log('   Run: node src/i18n/scripts/simple-converter.js <file>');
    process.exit(1);
  }
  
  console.log('✅ No direct t() usage found');
  process.exit(0);
} catch (error) {
  console.log('⚠️ Pre-commit check failed, allowing commit');
  process.exit(0);
}
