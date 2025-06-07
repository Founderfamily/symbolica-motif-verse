
import { supabase } from '@/integrations/supabase/client';

export interface BackupResult {
  id: string;
  status: 'success' | 'failed' | 'partial';
  timestamp: string;
  size: number;
  tables: string[];
  errors?: string[];
}

export interface BackupConfig {
  tables: string[];
  includeData: boolean;
  compression: boolean;
}

export const backupService = {
  async createFullBackup(): Promise<BackupResult> {
    const startTime = Date.now();
    const backupId = `backup_${Date.now()}`;
    
    try {
      // Tables principales à sauvegarder
      const tables = [
        'profiles', 'symbols', 'collections', 'user_contributions',
        'symbol_images', 'collection_translations', 'achievements',
        'user_points', 'interest_groups', 'patterns', 'symbol_locations'
      ];
      
      const backupData: any = {};
      const errors: string[] = [];
      let totalSize = 0;
      
      // Sauvegarder chaque table
      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('*');
          
          if (error) {
            errors.push(`Erreur table ${table}: ${error.message}`);
            continue;
          }
          
          backupData[table] = data;
          totalSize += JSON.stringify(data || []).length;
        } catch (err) {
          errors.push(`Exception table ${table}: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
        }
      }
      
      const processingTime = Date.now() - startTime;
      const status = errors.length === 0 ? 'success' : 
                   errors.length === tables.length ? 'failed' : 'partial';
      
      // Sauvegarder dans la nouvelle table system_backups
      const { error: insertError } = await supabase
        .from('system_backups')
        .insert({
          backup_key: backupId,
          status,
          size_bytes: totalSize,
          tables_backed_up: tables,
          config: { 
            includeData: true, 
            compression: false,
            processingTimeMs: processingTime
          },
          backup_data: backupData,
          errors: errors.length > 0 ? errors : undefined,
          completed_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Erreur sauvegarde metadata:', insertError);
      }
      
      return {
        id: backupId,
        status,
        timestamp: new Date().toISOString(),
        size: totalSize,
        tables,
        errors: errors.length > 0 ? errors : undefined
      };
      
    } catch (error) {
      console.error('Erreur création sauvegarde:', error);
      
      // Enregistrer l'échec
      const { error: insertError } = await supabase
        .from('system_backups')
        .insert({
          backup_key: backupId,
          status: 'failed',
          size_bytes: 0,
          tables_backed_up: [],
          config: {},
          errors: [error instanceof Error ? error.message : 'Erreur inconnue'],
          completed_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error('Erreur sauvegarde metadata échec:', insertError);
      }
      
      throw error;
    }
  },

  async listBackups(): Promise<BackupResult[]> {
    try {
      const { data, error } = await supabase
        .from('system_backups')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error('Erreur récupération sauvegardes:', error);
        return [];
      }
      
      return (data || []).map(backup => ({
        id: backup.backup_key,
        status: backup.status as 'success' | 'failed' | 'partial',
        timestamp: backup.created_at,
        size: backup.size_bytes,
        tables: backup.tables_backed_up || [],
        errors: backup.errors || undefined
      }));
      
    } catch (error) {
      console.error('Exception récupération sauvegardes:', error);
      return [];
    }
  },

  async cleanupOldBackups(retentionDays: number = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
      
      const { data, error } = await supabase
        .from('system_backups')
        .delete()
        .lt('created_at', cutoffDate.toISOString())
        .select('id');
      
      if (error) {
        console.error('Erreur nettoyage sauvegardes:', error);
        return 0;
      }
      
      return data?.length || 0;
      
    } catch (error) {
      console.error('Exception nettoyage sauvegardes:', error);
      return 0;
    }
  }
};
