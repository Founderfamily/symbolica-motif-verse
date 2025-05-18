
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

// Import the main module
const { main } = require('./generators');

// Run the script
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { main };
