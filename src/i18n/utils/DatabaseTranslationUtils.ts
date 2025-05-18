
import { translationDatabaseService } from '../services/translationDatabaseService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Utility functions for managing translations in the database
 */
export const DatabaseTranslationUtils = {
  /**
   * Check if translations exist in the database
   */
  async checkTranslationsExist(): Promise<boolean> {
    try {
      const { count, error } = await supabase
        .from('translations')
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error('Error checking translations:', error);
        return false;
      }
      
      return count !== null && count > 0;
    } catch (error) {
      console.error('Error checking translations existence:', error);
      return false;
    }
  },

  /**
   * Initialize translations from local files to database if needed
   */
  async initializeIfNeeded(): Promise<boolean> {
    try {
      const translationsExist = await this.checkTranslationsExist();
      
      if (!translationsExist) {
        console.log('No translations found in database, initializing from local files...');
        return await translationDatabaseService.initializeFromLocalFiles();
      }
      
      console.log('Translations already exist in database, skipping initialization.');
      return true;
    } catch (error) {
      console.error('Error initializing translations:', error);
      return false;
    }
  },

  /**
   * Export translations from database to local files
   */
  async exportToFiles(): Promise<boolean> {
    try {
      const success = await translationDatabaseService.exportToLocalFiles();
      
      if (success) {
        toast.success('Translations exported to files successfully');
        return true;
      } else {
        toast.error('Failed to export translations to files');
        return false;
      }
    } catch (error) {
      console.error('Error exporting translations to files:', error);
      toast.error('Error exporting translations to files');
      return false;
    }
  },

  /**
   * Import translations from local files to database
   */
  async importFromFiles(): Promise<boolean> {
    try {
      const success = await translationDatabaseService.initializeFromLocalFiles();
      
      if (success) {
        toast.success('Translations imported from files successfully');
        return true;
      } else {
        toast.error('Failed to import translations from files');
        return false;
      }
    } catch (error) {
      console.error('Error importing translations from files:', error);
      toast.error('Error importing translations from files');
      return false;
    }
  }
};
