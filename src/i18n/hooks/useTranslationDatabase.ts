
import { useState } from 'react';
import { DatabaseTranslationUtils } from '../utils/DatabaseTranslationUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for managing translations in the database
 */
export const useTranslationDatabase = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Check if translations exist in the database
   */
  const checkTranslationsExist = async () => {
    setIsLoading(true);
    try {
      const result = await DatabaseTranslationUtils.checkTranslationsExist();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Initialize translations from local files if needed
   */
  const initializeIfNeeded = async () => {
    setIsLoading(true);
    try {
      const result = await DatabaseTranslationUtils.initializeIfNeeded();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Force initialization from local files to database
   */
  const forceInitialization = async () => {
    setIsLoading(true);
    try {
      const result = await DatabaseTranslationUtils.importFromFiles();
      if (result) {
        toast({
          title: 'Success',
          description: 'Translation database initialized successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: 'Failed to initialize translation database',
          variant: 'destructive',
        });
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Export translations from database to local files
   */
  const exportToFiles = async () => {
    setIsLoading(true);
    try {
      const result = await DatabaseTranslationUtils.exportToFiles();
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get translation statistics
   */
  const getStatistics = async () => {
    setIsLoading(true);
    try {
      // Get English translations count
      const { count: enCount, error: enError } = await supabase
        .from('translations')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'en');
      
      if (enError) throw enError;
      
      // Get French translations count
      const { count: frCount, error: frError } = await supabase
        .from('translations')
        .select('*', { count: 'exact', head: true })
        .eq('language', 'fr');
      
      if (frError) throw frError;
      
      // Get latest validation result
      const { data: validationData, error: validationError } = await supabase
        .from('translation_validations')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(1)
        .single();
      
      return {
        totalEn: enCount || 0,
        totalFr: frCount || 0,
        missingEn: validationData?.missing_count_en || 0,
        missingFr: validationData?.missing_count_fr || 0,
        formatIssues: validationData?.format_issues_count || 0,
        validationError: validationError !== null,
      };
    } catch (error) {
      console.error('Error getting translation statistics:', error);
      toast({
        title: 'Error',
        description: 'Failed to get translation statistics',
        variant: 'destructive',
      });
      return {
        totalEn: 0,
        totalFr: 0,
        missingEn: 0,
        missingFr: 0,
        formatIssues: 0,
        validationError: true,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    checkTranslationsExist,
    initializeIfNeeded,
    forceInitialization,
    exportToFiles,
    getStatistics,
  };
};
