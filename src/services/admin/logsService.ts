
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
        .rpc('insert_admin_log', {
          p_admin_id: adminId,
          p_action: action,
          p_entity_type: entityType,
          p_entity_id: entityId || null,
          p_details: details || {}
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
        .rpc('get_admin_logs_with_profiles', { p_limit: limit });
        
      if (error) throw error;
      
      return (data || []).map((log: any) => ({
        id: log.id,
        admin_id: log.admin_id,
        action: log.action,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        details: log.details,
        created_at: log.created_at,
        admin_name: log.admin_name || 'Unknown'
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
        .rpc('get_entity_admin_logs', { 
          p_entity_type: entityType, 
          p_entity_id: entityId 
        });
        
      if (error) throw error;
      
      return (data || []).map((log: any) => ({
        id: log.id,
        admin_id: log.admin_id,
        action: log.action,
        entity_type: log.entity_type,
        entity_id: log.entity_id,
        details: log.details,
        created_at: log.created_at,
        admin_name: log.admin_name || 'Unknown'
      }));
    } catch (error) {
      console.error("Error fetching entity logs:", error);
      return [];
    }
  }
};
