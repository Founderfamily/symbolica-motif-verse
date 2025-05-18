
#!/usr/bin/env node

// This script makes all the i18n scripts executable

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scriptsDir = path.join(process.cwd(), 'src/i18n');
const files = [
  'convert-t-to-i18ntext.js',
  'convert-t-to-i18ntext.sh',
  'scripts/register-npm-scripts.js',
  'scripts/make-executable.js'
];

files.forEach(file => {
  const filePath = path.join(scriptsDir, file);
  
  if (fs.existsSync(filePath)) {
    try {
      execSync(`chmod +x ${filePath}`);
      console.log(`✅ Made executable: ${file}`);
    } catch (error) {
      console.error(`❌ Error making ${file} executable:`, error.message);
    }
  } else {
    console.warn(`⚠️ File not found: ${file}`);
  }
});

console.log('\n🚀 All translation scripts are now executable');
