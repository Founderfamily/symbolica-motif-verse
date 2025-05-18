
#!/usr/bin/env node

/**
 * Register Translation Scripts in package.json
 * 
 * This script adds the translation utilities to package.json scripts
 */

const fs = require('fs');
const path = require('path');

const PACKAGE_JSON_PATH = path.resolve(process.cwd(), 'package.json');

try {
  // Read the package.json file
  const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
  
  // Define the scripts to add
  const scriptsToAdd = {
    'initialize-translation-db': 'ts-node src/i18n/scripts/initialize-translation-db.ts',
    'sync-translations': 'ts-node src/i18n/scripts/sync-translations-db.ts',
    'fix-generic-keys': 'ts-node src/i18n/scripts/fix-generic-keys.ts',
    'translation-stats': 'ts-node -e "import { translationDatabaseService } from \'./src/i18n/services/translationDatabaseService\'; translationDatabaseService.getLatestValidationResult().then(console.log)"'
  };
  
  // Add the scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    ...scriptsToAdd
  };
  
  // Write the updated package.json
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2));
  
  console.log('✅ Translation scripts have been registered in package.json');
  console.log('You can now run the following commands:');
  console.log('  npm run initialize-translation-db');
  console.log('  npm run sync-translations');
  console.log('  npm run fix-generic-keys');
  console.log('  npm run translation-stats');
} catch (error) {
  console.error('Error registering translation scripts:', error);
  process.exit(1);
}
