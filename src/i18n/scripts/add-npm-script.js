
#!/usr/bin/env node

/**
 * Script pour ajouter la commande validate-i18n au package.json
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(__dirname, '../../../package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Ajouter le script s'il n'existe pas déjà
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  packageJson.scripts['validate-i18n'] = 'node src/i18n/scripts/validate-i18n.js';
  packageJson.scripts['validate-i18n:fix'] = 'node src/i18n/scripts/validate-i18n.js --fix';
  packageJson.scripts['validate-i18n:report'] = 'node src/i18n/scripts/validate-i18n.js --report=i18n-report.csv';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  
  console.log('✅ Scripts npm ajoutés avec succès:');
  console.log('   npm run validate-i18n');
  console.log('   npm run validate-i18n:fix');
  console.log('   npm run validate-i18n:report');
  
} catch (error) {
  console.error('❌ Erreur lors de l\'ajout des scripts:', error.message);
  console.log('\n📝 Ajoutez manuellement ces lignes dans package.json:');
  console.log('"scripts": {');
  console.log('  "validate-i18n": "node src/i18n/scripts/validate-i18n.js",');
  console.log('  "validate-i18n:fix": "node src/i18n/scripts/validate-i18n.js --fix",');
  console.log('  "validate-i18n:report": "node src/i18n/scripts/validate-i18n.js --report=i18n-report.csv"');
  console.log('}');
}
