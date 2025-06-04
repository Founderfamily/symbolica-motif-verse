
#!/usr/bin/env node

/**
 * Runner script to execute the i18n validation
 */

const { validateTranslations, displayResults, generateCSVReport } = require('./validate-i18n.js');

console.log('🔍 Exécution de la validation i18n...\n');

try {
  const results = validateTranslations();
  displayResults(results);
  
  // Exit with appropriate code
  const hasErrors = results.summary.undefinedKeysCount > 0 || results.summary.missingKeysCount > 0;
  process.exit(hasErrors ? 1 : 0);
} catch (error) {
  console.error('❌ Erreur lors de la validation:', error.message);
  process.exit(1);
}
