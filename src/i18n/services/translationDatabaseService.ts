
import { supabase } from '@/integrations/supabase/client';
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import { writeTranslationsToFile } from './translationFileService';

/**
 * Interface for translation entry in database
 */
export interface TranslationEntry {
  id?: string;
  key: string;
  language: string;
  value: string;
  status?: string;
  last_updated?: string;
  created_at?: string;
}

/**
 * Interface for validation result entry in database
 */
export interface ValidationResultEntry {
  id?: string;
  timestamp?: string;
  valid: boolean;
  missing_count_fr: number;
  missing_count_en: number;
  format_issues_count: number;
  invalid_key_format_count: number;
  summary?: string;
  details?: any;
}

/**
 * Service to interact with translations in the database
 */
export const translationDatabaseService = {
  /**
   * Fetch all translations from the database
   */
  async getAllTranslations(): Promise<TranslationEntry[]> {
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .order('key');
    
    if (error) {
      console.error('Error fetching translations:', error);
      return [];
    }
    
    return data || [];
  },
  
  /**
   * Get translations for a specific language
   */
  async getTranslationsByLanguage(language: string): Promise<TranslationEntry[]> {
    const { data, error } = await supabase
      .from('translations')
      .select('*')
      .eq('language', language)
      .order('key');
    
    if (error) {
      console.error(`Error fetching ${language} translations:`, error);
      return [];
    }
    
    return data || [];
  },
  
  /**
   * Save a translation to the database
   */
  async saveTranslation(translation: TranslationEntry): Promise<TranslationEntry | null> {
    const { data, error } = await supabase
      .from('translations')
      .upsert({
        key: translation.key,
        language: translation.language,
        value: translation.value,
        status: translation.status || 'active',
        last_updated: new Date().toISOString()
      }, {
        onConflict: 'key,language'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving translation:', error);
      return null;
    }
    
    return data;
  },
  
  /**
   * Save multiple translations at once
   */
  async saveMultipleTranslations(translations: TranslationEntry[]): Promise<number> {
    const { data, error } = await supabase
      .from('translations')
      .upsert(
        translations.map(t => ({
          key: t.key,
          language: t.language,
          value: t.value,
          status: t.status || 'active',
          last_updated: new Date().toISOString()
        })),
        {
          onConflict: 'key,language'
        }
      );
    
    if (error) {
      console.error('Error saving multiple translations:', error);
      return 0;
    }
    
    return translations.length;
  },
  
  /**
   * Delete a translation from the database
   */
  async deleteTranslation(key: string, language: string): Promise<boolean> {
    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('key', key)
      .eq('language', language);
    
    if (error) {
      console.error('Error deleting translation:', error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Delete multiple translations with the same key across languages
   */
  async deleteTranslationKey(key: string): Promise<boolean> {
    const { error } = await supabase
      .from('translations')
      .delete()
      .eq('key', key);
    
    if (error) {
      console.error('Error deleting translation key:', error);
      return false;
    }
    
    return true;
  },
  
  /**
   * Save a validation result
   */
  async saveValidationResult(result: ValidationResultEntry): Promise<string | null> {
    const { data, error } = await supabase
      .from('translation_validations')
      .insert({
        valid: result.valid,
        missing_count_fr: result.missing_count_fr,
        missing_count_en: result.missing_count_en,
        format_issues_count: result.format_issues_count,
        invalid_key_format_count: result.invalid_key_format_count,
        summary: result.summary,
        details: result.details
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error saving validation result:', error);
      return null;
    }
    
    return data?.id;
  },
  
  /**
   * Get the latest validation result
   */
  async getLatestValidationResult(): Promise<ValidationResultEntry | null> {
    const { data, error } = await supabase
      .from('translation_validations')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      if (error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching latest validation result:', error);
      }
      return null;
    }
    
    return data;
  },
  
  /**
   * Get validation history
   */
  async getValidationHistory(limit = 10): Promise<ValidationResultEntry[]> {
    const { data, error } = await supabase
      .from('translation_validations')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching validation history:', error);
      return [];
    }
    
    return data || [];
  },
  
  /**
   * Initialize database with translations from local files
   * Used for initial setup or resetting
   */
  async initializeFromLocalFiles(): Promise<boolean> {
    try {
      const enTranslations = await this.flattenTranslationsObject(en);
      const frTranslations = await this.flattenTranslationsObject(fr);
      
      const translations: TranslationEntry[] = [];
      
      for (const [key, value] of Object.entries(enTranslations)) {
        translations.push({
          key,
          language: 'en',
          value: value.toString()
        });
      }
      
      for (const [key, value] of Object.entries(frTranslations)) {
        translations.push({
          key,
          language: 'fr',
          value: value.toString()
        });
      }
      
      await this.saveMultipleTranslations(translations);
      return true;
    } catch (error) {
      console.error('Error initializing translations from files:', error);
      return false;
    }
  },
  
  /**
   * Export translations from database to local files
   */
  async exportToLocalFiles(): Promise<boolean> {
    try {
      const enTranslations = await this.getTranslationsByLanguage('en');
      const frTranslations = await this.getTranslationsByLanguage('fr');
      
      const enObject = this.buildNestedObject(enTranslations);
      const frObject = this.buildNestedObject(frTranslations);
      
      await writeTranslationsToFile('en', enObject);
      await writeTranslationsToFile('fr', frObject);
      
      return true;
    } catch (error) {
      console.error('Error exporting translations to files:', error);
      return false;
    }
  },
  
  /**
   * Helper method to flatten a nested translations object
   */
  async flattenTranslationsObject(obj: any, prefix = ''): Promise<Record<string, string>> {
    const result: Record<string, string> = {};
    
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        const nested = await this.flattenTranslationsObject(obj[key], fullKey);
        Object.assign(result, nested);
      } else {
        result[fullKey] = obj[key].toString();
      }
    }
    
    return result;
  },
  
  /**
   * Helper method to build a nested object from flattened translations
   */
  buildNestedObject(translations: TranslationEntry[]): Record<string, any> {
    const result: Record<string, any> = {};
    
    for (const translation of translations) {
      const keys = translation.key.split('.');
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }
      
      const lastKey = keys[keys.length - 1];
      current[lastKey] = translation.value;
    }
    
    return result;
  }
};
