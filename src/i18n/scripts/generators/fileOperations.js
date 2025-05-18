
/**
 * File operation utilities for translations
 */

const fs = require('fs');
const path = require('path');

// Helper to ensure a directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

/**
 * Load existing translations
 */
const loadTranslations = (lang, localesDir) => {
  const filePath = path.join(localesDir, `${lang}.json`);
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (error) {
    console.error(`Error loading ${lang}.json:`, error.message);
  }
  return {};
};

/**
 * Write translation file
 */
const writeTranslationFile = (lang, data, localesDir, isDryRun = false, isGenerated = false) => {
  ensureDirectoryExists(localesDir);
  const filename = isGenerated ? `${lang}.generated.json` : `${lang}.json`;
  const filePath = path.join(localesDir, filename);
  
  if (isDryRun) {
    console.log(`Would write ${filePath} (dry run)`);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Wrote ${filePath}`);
  }
};

module.exports = {
  ensureDirectoryExists,
  loadTranslations,
  writeTranslationFile
};
