
import { supabase } from '@/integrations/supabase/client';
import { adminLogsService } from './logsService';

export interface BackupConfig {
  tables: string[];
  retentionDays: number;
  compressionEnabled: boolean;
  encryptionEnabled: boolean;
}

export interface BackupResult {
  id: string;
  timestamp: string;
  size: number;
  status: 'success' | 'failed' | 'partial';
  tables: string[];
  errors?: string[];
}

/**
 * Service pour la gestion des sauvegardes automatiques
 */
export const backupService = {
  /**
   * Configuration par défaut des sauvegardes
   */
  defaultConfig: {
    tables: [
      'profiles',
      'user_contributions', 
      'collections',
      'symbols',
      'user_activities',
      'admin_logs',
      'notifications'
    ],
    retentionDays: 30,
    compressionEnabled: true,
    encryptionEnabled: true
  } as BackupConfig,

  /**
   * Crée une sauvegarde complète
   */
  createFullBackup: async (config?: Partial<BackupConfig>): Promise<BackupResult> => {
    const finalConfig = { ...backupService.defaultConfig, ...config };
    const backupId = `backup_${Date.now()}`;
    const timestamp = new Date().toISOString();
    
    try {
      const backupData: any = {};
      const errors: string[] = [];
      let totalSize = 0;

      // Sauvegarder chaque table
      for (const table of finalConfig.tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*');

          if (error) {
            errors.push(`Erreur table ${table}: ${error.message}`);
            continue;
          }

          backupData[table] = data;
          totalSize += JSON.stringify(data).length;
        } catch (error) {
          errors.push(`Erreur critique table ${table}: ${error}`);
        }
      }

      // Stocker la sauvegarde
      const { error: storeError } = await supabase
        .from('content_sections')
        .upsert({
          section_key: backupId,
          content: {
            backup_metadata: {
              id: backupId,
              timestamp,
              config: finalConfig,
              size: totalSize,
              status: errors.length === 0 ? 'success' : 
                     errors.length === finalConfig.tables.length ? 'failed' : 'partial'
            },
            backup_data: backupData
          }
        });

      if (storeError) {
        throw new Error(`Erreur stockage: ${storeError.message}`);
      }

      const result: BackupResult = {
        id: backupId,
        timestamp,
        size: totalSize,
        status: errors.length === 0 ? 'success' : 
               errors.length === finalConfig.tables.length ? 'failed' : 'partial',
        tables: finalConfig.tables,
        errors: errors.length > 0 ? errors : undefined
      };

      // Logger l'action
      await adminLogsService.logAction(
        'system',
        'create_backup',
        'backup',
        backupId,
        result
      );

      return result;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return {
        id: backupId,
        timestamp,
        size: 0,
        status: 'failed',
        tables: finalConfig.tables,
        errors: [error.message]
      };
    }
  },

  /**
   * Liste les sauvegardes disponibles
   */
  listBackups: async (): Promise<BackupResult[]> => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('section_key, content, created_at')
        .like('section_key', 'backup_%')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(backup => {
        const metadata = backup.content?.backup_metadata;
        return {
          id: backup.section_key,
          timestamp: backup.created_at,
          size: metadata?.size || 0,
          status: metadata?.status || 'unknown',
          tables: metadata?.config?.tables || [],
          errors: metadata?.errors
        };
      }) || [];
    } catch (error) {
      console.error('Erreur listage sauvegardes:', error);
      return [];
    }
  },

  /**
   * Supprime les anciennes sauvegardes
   */
  cleanupOldBackups: async (retentionDays: number = 30): Promise<number> => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

      const { data, error } = await supabase
        .from('content_sections')
        .select('section_key')
        .like('section_key', 'backup_%')
        .lt('created_at', cutoffDate.toISOString());

      if (error) throw error;

      if (!data || data.length === 0) return 0;

      const { error: deleteError } = await supabase
        .from('content_sections')
        .delete()
        .in('section_key', data.map(b => b.section_key));

      if (deleteError) throw deleteError;

      await adminLogsService.logAction(
        'system',
        'cleanup_backups',
        'maintenance',
        undefined,
        { deleted_count: data.length, retention_days: retentionDays }
      );

      return data.length;
    } catch (error) {
      console.error('Erreur nettoyage sauvegardes:', error);
      return 0;
    }
  },

  /**
   * Restaure une sauvegarde (simulation - dangereux en production)
   */
  validateBackup: async (backupId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('content')
        .eq('section_key', backupId)
        .single();

      if (error || !data) return false;

      const backupData = data.content?.backup_data;
      if (!backupData) return false;

      // Vérifier l'intégrité des données
      let valid = true;
      for (const [table, tableData] of Object.entries(backupData)) {
        if (!Array.isArray(tableData)) {
          valid = false;
          break;
        }
      }

      return valid;
    } catch (error) {
      console.error('Erreur validation sauvegarde:', error);
      return false;
    }
  }
};
