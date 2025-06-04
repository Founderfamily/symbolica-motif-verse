
#!/usr/bin/env node

/**
 * Script simple pour exécuter la validation i18n et afficher les résultats
 */

const { validateTranslations, displayResults } = require('./validate-i18n.js');

console.log('🔍 Exécution de la validation i18n...\n');

try {
  const results = validateTranslations();
  
  console.log('📊 RÉSULTATS DE LA VALIDATION');
  console.log('============================\n');
  
  displayResults(results);
  
  console.log('\n🎯 RÉSUMÉ FINAL:');
  if (results.summary.missingKeysCount === 0 && 
      results.summary.undefinedKeysCount === 0 && 
      results.summary.formatIssuesCount === 0) {
    console.log('✅ Toutes les traductions sont valides !');
  } else {
    console.log(`❌ ${results.summary.missingKeysCount + results.summary.undefinedKeysCount + results.summary.formatIssuesCount} problèmes détectés`);
  }
  
} catch (error) {
  console.error('❌ Erreur lors de la validation:', error.message);
  console.error('Stack trace:', error.stack);
}
