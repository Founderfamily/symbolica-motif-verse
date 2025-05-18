
// Script to sync translations between database and files
// Adapted for browser environment from a Node.js script

import { translationDatabaseService } from '../services/translationDatabaseService';

/**
 * Functions for syncing translations between database and files
 */
export const syncTranslationsDb = {
  
  /**
   * Export translations from database to local files
   */
  async exportToFiles(): Promise<boolean> {
    console.log('Exporting translations from database to local files...');
    
    try {
      const success = await translationDatabaseService.exportToLocalFiles();
      
      if (success) {
        console.log('Successfully exported translations to files.');
      } else {
        console.error('Failed to export translations to files.');
      }
      
      return success;
    } catch (error) {
      console.error('Error exporting translations to files:', error);
      return false;
    }
  },
  
  /**
   * Import translations from local files to database
   */
  async importFromFiles(): Promise<boolean> {
    console.log('Importing translations from local files to database...');
    
    try {
      const success = await translationDatabaseService.initializeFromLocalFiles();
      
      if (success) {
        console.log('Successfully imported translations from files to database.');
      } else {
        console.error('Failed to import translations from files to database.');
      }
      
      return success;
    } catch (error) {
      console.error('Error importing translations from files to database:', error);
      return false;
    }
  },
  
  /**
   * Validate translations
   */
  async validateTranslations(): Promise<boolean> {
    console.log('Validating translations...');
    
    try {
      // Call validation function (not implemented in this example)
      // const result = await translationDatabaseService.validateTranslations();
      return true;
    } catch (error) {
      console.error('Error validating translations:', error);
      return false;
    }
  }
};

export default syncTranslationsDb;
