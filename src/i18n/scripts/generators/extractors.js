
/**
 * Translation key extractors
 */

const fs = require('fs');
const glob = require('glob');

/**
 * Extract translation keys from source files
 */
const extractTranslationKeys = (sourceDir = 'src') => {
  console.log(`\n🔍 Scanning for translation keys in ${sourceDir}...`);
  
  const allFiles = glob.sync(`${sourceDir}/**/*.{ts,tsx,js,jsx}`, { nodir: true });
  const keys = new Set();
  const keysWithContext = [];
  
  // Regex patterns to match translation keys
  const patterns = [
    /translationKey=["']([^"']+)["']/g,         // translationKey="key"
    /translationKey={["']([^"']+)["']}/g,       // translationKey={"key"}
    /t\(["']([^"']+)["']\)/g,                   // t("key")
    /t\(["']([^"']+)["'],/g,                    // t("key", {...})
    /useTranslation\(\)\.t\(["']([^"']+)["']\)/g // useTranslation().t("key")
  ];
  
  allFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        keys.add(match[1]);
        keysWithContext.push({
          key: match[1],
          file,
          line: content.substring(0, match.index).split('\n').length
        });
      }
    });
  });
  
  console.log(`Found ${keys.size} unique translation keys in ${allFiles.length} files`);
  return { keys: Array.from(keys).sort(), keysWithContext };
};

module.exports = {
  extractTranslationKeys
};
