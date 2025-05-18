
#!/usr/bin/env node

/**
 * Generic Translation Key Finder
 * 
 * This script identifies generic translation keys like "Title", "Subtitle" that
 * should be replaced with more specific hierarchical keys.
 * 
 * Usage:
 *   node find-generic-keys.js [--detail]
 * 
 * Options:
 *   --detail   Show detailed information about each occurrence
 */

// Import the main module
const { main } = require('./generic-keys');

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = { main };
