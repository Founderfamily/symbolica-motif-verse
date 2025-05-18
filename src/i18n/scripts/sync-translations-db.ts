
#!/usr/bin/env node

/**
 * Translation Synchronization Utility
 * 
 * Synchronizes translations between local JSON files and the database
 * 
 * Usage:
 *   npm run sync-translations -- [--direction=<db-to-file|file-to-db|both>]
 */

import { translationDatabaseService } from '../services/translationDatabaseService';
import { readTranslationsFromFile } from '../services/translationFileService';

// Parse command line arguments
const args = process.argv.slice(2);
const directionArg = args.find(arg => arg.startsWith('--direction='));
const direction = directionArg 
  ? directionArg.split('=')[1]
  : 'both';

async function syncTranslations() {
  console.log('=== Translation Synchronization Tool ===');
  
  try {
    if (direction === 'file-to-db' || direction === 'both') {
      console.log('\nSynchronizing from local files to database...');
      const success = await translationDatabaseService.initializeFromLocalFiles();
      
      if (success) {
        console.log('✅ Successfully imported translations from files to database');
      } else {
        console.error('❌ Failed to import translations from files to database');
      }
    }
    
    if (direction === 'db-to-file' || direction === 'both') {
      console.log('\nSynchronizing from database to local files...');
      const success = await translationDatabaseService.exportToLocalFiles();
      
      if (success) {
        console.log('✅ Successfully exported translations from database to files');
      } else {
        console.error('❌ Failed to export translations from database to files');
      }
    }
    
    console.log('\nSynchronization complete!');
    return true;
  } catch (error) {
    console.error('Error during synchronization:', error);
    return false;
  }
}

// Run the synchronization if this file is executed directly
if (require.main === module) {
  syncTranslations()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

export default syncTranslations;
