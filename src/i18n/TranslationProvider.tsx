
import React, { ReactNode, useEffect, useState } from 'react';
import { useTranslation } from './useTranslation';
import { toast } from 'sonner';
import { translationDatabaseService } from './services/translationDatabaseService';
import { supabase } from '@/integrations/supabase/client';

type TranslationProviderProps = {
  children: ReactNode;
};

/**
 * Global Translation Provider that manages translation state
 * and provides language consistency across the application
 */
export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const { currentLanguage, refreshLanguage } = useTranslation();
  const [isInitializingTranslations, setIsInitializingTranslations] = useState(false);
  
  // Check if translations are in database and initialize if needed
  useEffect(() => {
    const checkAndInitializeTranslations = async () => {
      try {
        // Check if translations exist in the database
        const { count, error } = await supabase
          .from('translations')
          .select('*', { count: 'exact', head: true });
        
        // If no translations found or error occurred, initialize from local files
        if (error || count === 0) {
          console.log('No translations found in database, initializing from local files...');
          setIsInitializingTranslations(true);
          
          const success = await translationDatabaseService.initializeFromLocalFiles();
          
          if (success) {
            console.log('Successfully initialized translations database from local files.');
            toast.success('Translation database initialized successfully');
          } else {
            console.error('Failed to initialize translations database');
            toast.error('Failed to initialize translations');
          }
          
          setIsInitializingTranslations(false);
        } else {
          console.log(`Found ${count} translations in database.`);
        }
      } catch (error) {
        console.error('Error checking translations:', error);
        setIsInitializingTranslations(false);
      }
    };
    
    checkAndInitializeTranslations();
  }, []);
  
  // Initialize and maintain language consistency
  useEffect(() => {
    console.log('TranslationProvider: Initializing with language', currentLanguage);
    refreshLanguage();
    
    // Listen for language changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'app_language' && event.newValue) {
        console.log('Language changed in another tab:', event.newValue);
        refreshLanguage();
        toast.info(`Language changed to ${event.newValue === 'fr' ? 'French' : 'English'}`);
      }
    };
    
    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currentLanguage, refreshLanguage]);
  
  if (isInitializingTranslations) {
    // Simple loading indicator while initializing translations
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-3 text-lg font-medium">Initializing translations...</p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default TranslationProvider;
