
import { supabase } from '@/integrations/supabase/client';

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: any;
  created_at: string;
  admin_name?: string;
}

/**
 * Service pour gérer les logs d'administration
 */
export const adminLogsService = {
  /**
   * Enregistre une action administrative
   */
  logAction: async (
    adminId: string,
    action: string,
    entityType: string,
    entityId?: string,
    details?: Record<string, any>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('admin_logs')
        .insert({
          admin_id: adminId,
          action,
          entity_type: entityType,
          entity_id: entityId || null,
          details: details || {}
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error logging admin action:", error);
      return false;
    }
  },
  
  /**
   * Récupère les dernières actions administratives
   */
  getRecentLogs: async (limit: number = 50): Promise<AdminLog[]> => {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select(`
          *,
          profiles:admin_id (
            username,
            full_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      
      // Format data to include admin name
      return (data || []).map(log => ({
        ...log,
        admin_name: log.profiles?.full_name || log.profiles?.username || 'Unknown'
      }));
    } catch (error) {
      console.error("Error fetching admin logs:", error);
      return [];
    }
  },
  
  /**
   * Récupère les logs liés à une entité spécifique
   */
  getEntityLogs: async (entityType: string, entityId: string): Promise<AdminLog[]> => {
    try {
      const { data, error } = await supabase
        .from('admin_logs')
        .select(`
          *,
          profiles:admin_id (
            username,
            full_name
          )
        `)
        .match({ entity_type: entityType, entity_id: entityId })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      // Format data to include admin name
      return (data || []).map(log => ({
        ...log,
        admin_name: log.profiles?.full_name || log.profiles?.username || 'Unknown'
      }));
    } catch (error) {
      console.error("Error fetching entity logs:", error);
      return [];
    }
  }
};
