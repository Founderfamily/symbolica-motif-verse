
import { supabase } from '@/integrations/supabase/client';
import { SecurityUtils } from '@/utils/securityUtils';

export interface AdminLog {
  id: string;
  admin_id: string;
  admin_name?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  created_at: string;
}

export const adminLogsService = {
  async getRecentLogs(limit: number = 50): Promise<AdminLog[]> {
    try {
      // Rate limiting check
      if (!SecurityUtils.checkRateLimit('admin_logs_fetch', 10, 60000)) {
        throw new Error('Rate limit exceeded');
      }

      const { data, error } = await supabase
        .rpc('get_admin_logs_with_profiles', { p_limit: limit });

      if (error) {
        console.error('Error fetching admin logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in adminLogsService.getRecentLogs:', error);
      return [];
    }
  },

  async createLog(action: string, entityType: string, entityId?: string, details?: Record<string, any>): Promise<void> {
    try {
      // Validate inputs
      const sanitizedAction = SecurityUtils.validateInput(action, 100);
      const sanitizedEntityType = SecurityUtils.validateInput(entityType, 50);
      
      // Sanitize details object
      const sanitizedDetails = details ? this.sanitizeDetails(details) : {};

      // Use the database function for secure logging
      const { error } = await supabase
        .rpc('insert_admin_log', {
          p_admin_id: (await supabase.auth.getUser()).data.user?.id,
          p_action: sanitizedAction,
          p_entity_type: sanitizedEntityType,
          p_entity_id: entityId || null,
          p_details: sanitizedDetails
        });

      if (error) {
        console.error('Error creating admin log:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in adminLogsService.createLog:', error);
      throw error;
    }
  },

  async getEntityLogs(entityType: string, entityId: string): Promise<AdminLog[]> {
    try {
      // Validate inputs
      const sanitizedEntityType = SecurityUtils.validateInput(entityType, 50);
      const sanitizedEntityId = SecurityUtils.validateInput(entityId, 100);

      const { data, error } = await supabase
        .rpc('get_entity_admin_logs', {
          p_entity_type: sanitizedEntityType,
          p_entity_id: sanitizedEntityId
        });

      if (error) {
        console.error('Error fetching entity logs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in adminLogsService.getEntityLogs:', error);
      return [];
    }
  },

  // Helper method to sanitize details object
  sanitizeDetails(details: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};
    
    for (const [key, value] of Object.entries(details)) {
      if (typeof value === 'string') {
        sanitized[key] = SecurityUtils.sanitizeHtml(value);
      } else if (typeof value === 'number' || typeof value === 'boolean') {
        sanitized[key] = value;
      } else if (value !== null && value !== undefined) {
        sanitized[key] = String(value);
      }
    }
    
    return sanitized;
  }
};
