
#!/usr/bin/env node

/**
 * Initialize Translation Database
 * 
 * This script initializes the translation database with data from local JSON files.
 * It's useful for first-time setup or when resetting the database.
 * 
 * Usage: npm run initialize-translation-db
 */

import { translationDatabaseService } from '../services/translationDatabaseService';

async function initializeDatabase() {
  console.log('=== Translation Database Initialization ===\n');
  console.log('Loading translations from local files...');
  
  try {
    const success = await translationDatabaseService.initializeFromLocalFiles();
    
    if (success) {
      console.log('✅ Successfully initialized translation database from local files');
    } else {
      console.error('❌ Failed to initialize translation database');
      return false;
    }
    
    console.log('\nAll translations have been imported to the database.');
    console.log('\nYou can now use the database as the source of truth for translations.');
    console.log('Run the sync utility to keep the database and files in sync:');
    console.log('  npm run sync-translations -- --direction=db-to-file');
    
    return true;
  } catch (error) {
    console.error('Error during database initialization:', error);
    return false;
  }
}

// Run the initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}
