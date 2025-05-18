
#!/usr/bin/env node

/**
 * Comprehensive Translation Validation Utility
 * 
 * This script performs thorough validation of translation files:
 * - Missing keys between languages
 * - Format inconsistencies (placeholders, HTML tags)
 * - Structure consistency
 * - Key naming convention compliance
 * 
 * Usage:
 *   node check-translation-completeness.js [--fix] [--report=file.md]
 * 
 * Options:
 *   --fix       Attempt to automatically fix simple issues
 *   --report    Generate a markdown report file
 */

// Import the main validator
const { validateTranslations } = require('./validators');

// Run validation
if (require.main === module) {
  const { exitCode } = validateTranslations();
  process.exit(exitCode);
}

module.exports = { validateTranslations };
