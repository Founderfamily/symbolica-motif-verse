
#!/usr/bin/env node

/**
 * Translation Key Generator
 * 
 * This script scans your project for I18nText usage and generates missing translation keys.
 * 
 * Usage:
 *   node i18n-generate-missing.js [--dry-run]
 * 
 * Options:
 *   --dry-run   Only show what would be done without modifying files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Parse arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const mode = isDryRun ? 'DRY RUN' : 'UPDATE';

// Configuration
const SOURCE_DIR = 'src';
const LOCALES_DIR = path.join('src', 'i18n', 'locales');
const LANGUAGES = ['en', 'fr'];

// Helper to ensure a directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Extract translation keys from source files
const extractTranslationKeys = () => {
  console.log(`\n🔍 Scanning for translation keys in ${SOURCE_DIR}...`);
  
  const allFiles = glob.sync(`${SOURCE_DIR}/**/*.{ts,tsx,js,jsx}`, { nodir: true });
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

// Generate nested object from dot notation keys
const buildNestedObject = (keys) => {
  const result = {};
  
  keys.forEach(key => {
    const parts = key.split('.');
    let current = result;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // Last part, set the value
        current[part] = current[part] || null;
      } else {
        // Create nested object if needed
        current[part] = current[part] || {};
        current = current[part];
      }
    }
  });
  
  return result;
};

// Deep merge two objects
const deepMerge = (target, source) => {
  const output = Object.assign({}, target);
  
  if (typeof target !== 'object' || target === null) {
    return source;
  }
  
  if (typeof source !== 'object' || source === null) {
    return output;
  }
  
  Object.keys(source).forEach(key => {
    const targetValue = output[key];
    const sourceValue = source[key];
    
    if (
      Array.isArray(targetValue) && Array.isArray(sourceValue)
    ) {
      output[key] = [...targetValue, ...sourceValue.filter(item => !targetValue.includes(item))];
    } else if (
      typeof targetValue === 'object' && targetValue !== null &&
      typeof sourceValue === 'object' && sourceValue !== null
    ) {
      output[key] = deepMerge(targetValue, sourceValue);
    } else if (output[key] === undefined) {
      output[key] = sourceValue;
    }
  });
  
  return output;
};

// Add missing translation placeholders
const addMissingTranslations = (translationObj, keys, lang) => {
  const missingKeys = [];
  const nestedObj = buildNestedObject(keys);
  
  // Helper function to process nested objects
  const processNested = (target, source, prefix = '') => {
    Object.keys(source).forEach(key => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof source[key] === 'object' && source[key] !== null) {
        // Create object if it doesn't exist
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {};
        }
        
        // Process nested object
        processNested(target[key], source[key], fullKey);
      } else if (target[key] === undefined) {
        // Add placeholder for missing leaf node
        target[key] = `[TODO ${lang}] ${fullKey}`;
        missingKeys.push(fullKey);
      }
    });
  };
  
  // Process the object
  processNested(translationObj, nestedObj);
  
  return { translationObj, missingKeys };
};

// Load existing translations
const loadTranslations = (lang) => {
  const filePath = path.join(LOCALES_DIR, `${lang}.json`);
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (error) {
    console.error(`Error loading ${lang}.json:`, error.message);
  }
  return {};
};

// Sort keys in an object (recursive)
const sortObjectKeys = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  // Sort object keys
  return Object.keys(obj).sort().reduce((result, key) => {
    result[key] = typeof obj[key] === 'object' && obj[key] !== null
      ? sortObjectKeys(obj[key])
      : obj[key];
    return result;
  }, {});
};

// Write translation file
const writeTranslationFile = (lang, data, isGenerated = false) => {
  ensureDirectoryExists(LOCALES_DIR);
  const filename = isGenerated ? `${lang}.generated.json` : `${lang}.json`;
  const filePath = path.join(LOCALES_DIR, filename);
  
  if (isDryRun) {
    console.log(`Would write ${filePath} (dry run)`);
  } else {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ Wrote ${filePath}`);
  }
};

// Generate missing translations report
const generateReport = (keysWithContext, allMissingKeys) => {
  const reportPath = path.join(process.cwd(), 'translation-missing-report.md');
  let report = `# Missing Translation Keys Report\n\n`;
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;
  
  // Group missing keys by language
  const byLanguage = {};
  
  LANGUAGES.forEach(lang => {
    byLanguage[lang] = allMissingKeys[lang] || [];
    
    report += `## Missing in ${lang} (${byLanguage[lang].length} keys)\n\n`;
    
    if (byLanguage[lang].length === 0) {
      report += `No missing keys found. Great job! 🎉\n\n`;
    } else {
      // Create a table
      report += `| Key | File | Line |\n`;
      report += `| --- | ---- | ---- |\n`;
      
      byLanguage[lang].forEach(key => {
        // Find where this key is used
        const usages = keysWithContext.filter(k => k.key === key);
        
        if (usages.length > 0) {
          const usage = usages[0]; // Take the first usage
          const shortFilePath = usage.file.replace(process.cwd(), '');
          report += `| \`${key}\` | ${shortFilePath} | ${usage.line} |\n`;
        } else {
          report += `| \`${key}\` | Unknown | - |\n`;
        }
      });
      
      report += `\n`;
    }
  });
  
  if (isDryRun) {
    console.log(`Would write ${reportPath} (dry run)`);
  } else {
    fs.writeFileSync(reportPath, report, 'utf-8');
    console.log(`✅ Report saved to ${reportPath}`);
  }
};

// Main function
const main = () => {
  console.log(`\n🌍 Translation Key Generator (${mode})`);
  console.log('=================================');
  
  // Extract all translation keys from source files
  const { keys, keysWithContext } = extractTranslationKeys();
  
  // Process each language
  const stats = {};
  const allMissingKeys = {};
  
  LANGUAGES.forEach(lang => {
    console.log(`\n📝 Processing ${lang} translations...`);
    
    // Load existing translations
    const existingTranslations = loadTranslations(lang);
    
    // Add missing translations
    const { translationObj, missingKeys } = addMissingTranslations(
      structuredClone(existingTranslations), 
      keys,
      lang
    );
    
    // Sort keys in the translation object
    const sortedTranslations = sortObjectKeys(translationObj);
    
    // Write updated translations to generated file
    writeTranslationFile(lang, sortedTranslations, true);
    
    // Save stats
    stats[lang] = {
      total: keys.length,
      existing: keys.length - missingKeys.length,
      missing: missingKeys.length
    };
    
    allMissingKeys[lang] = missingKeys;
    
    console.log(`Found ${missingKeys.length} missing keys for ${lang}`);
    if (missingKeys.length > 0 && missingKeys.length <= 10) {
      console.log('Missing keys:', missingKeys.join(', '));
    }
  });
  
  // Generate report
  generateReport(keysWithContext, allMissingKeys);
  
  // Print summary
  console.log('\n✅ Summary:');
  LANGUAGES.forEach(lang => {
    const { total, existing, missing } = stats[lang];
    const coverage = Math.round((existing / total) * 100);
    console.log(`- ${lang}: ${existing}/${total} keys (${coverage}% coverage), ${missing} missing`);
  });
  
  console.log('\n📋 Next steps:');
  console.log('1. Review the generated translation files in:');
  LANGUAGES.forEach(lang => {
    console.log(`   - ${path.join(LOCALES_DIR, `${lang}.generated.json`)}`);
  });
  
  console.log('2. Copy the content to your main translation files:');
  LANGUAGES.forEach(lang => {
    console.log(`   - ${path.join(LOCALES_DIR, `${lang}.json`)}`);
  });
  
  console.log('3. Replace placeholder values with proper translations');
  
  return { stats, allMissingKeys };
};

// Run the script
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { main, extractTranslationKeys };
