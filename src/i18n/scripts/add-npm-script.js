
#!/usr/bin/env node

/**
 * Guide pour ajouter les commandes validate-i18n au package.json
 * 
 * Ce script ne peut pas modifier package.json automatiquement dans cet environnement,
 * mais il vous explique comment le faire manuellement.
 */

console.log('📋 AJOUT MANUEL DES SCRIPTS NPM');
console.log('===============================\n');

console.log('Pour utiliser le script de validation i18n avec npm, ajoutez ces lignes');
console.log('dans la section "scripts" de votre package.json :\n');

console.log('"scripts": {');
console.log('  "validate-i18n": "node src/i18n/scripts/validate-i18n.js",');
console.log('  "validate-i18n:fix": "node src/i18n/scripts/validate-i18n.js --fix",');
console.log('  "validate-i18n:report": "node src/i18n/scripts/validate-i18n.js --report=i18n-report.csv"');
console.log('}\n');

console.log('Ensuite vous pourrez utiliser :');
console.log('✅ npm run validate-i18n');
console.log('✅ npm run validate-i18n:fix');
console.log('✅ npm run validate-i18n:report\n');

console.log('OU directement avec node :');
console.log('✅ node src/i18n/scripts/validate-i18n.js');
console.log('✅ node src/i18n/scripts/validate-i18n.js --fix');
console.log('✅ node src/i18n/scripts/validate-i18n.js --report=rapport.csv');
