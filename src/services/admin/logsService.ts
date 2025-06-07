
import { supabase } from '@/integrations/supabase/client';

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
      // Simuler des logs pour le moment car nous n'avons pas encore la table admin_logs
      const mockLogs: AdminLog[] = [
        {
          id: '1',
          admin_id: 'admin-1',
          admin_name: 'Admin User',
          action: 'create',
          entity_type: 'user',
          entity_id: 'user-123',
          details: { username: 'newuser', email: 'new@example.com' },
          created_at: new Date(Date.now() - 60000).toISOString()
        },
        {
          id: '2',
          admin_id: 'admin-1',
          admin_name: 'Admin User',
          action: 'update',
          entity_type: 'symbol',
          entity_id: 'symbol-456',
          details: { field: 'status', old_value: 'pending', new_value: 'approved' },
          created_at: new Date(Date.now() - 120000).toISOString()
        },
        {
          id: '3',
          admin_id: 'admin-1',
          admin_name: 'Admin User',
          action: 'delete',
          entity_type: 'contribution',
          entity_id: 'contrib-789',
          details: { reason: 'inappropriate content' },
          created_at: new Date(Date.now() - 180000).toISOString()
        }
      ];

      return mockLogs.slice(0, limit);
    } catch (error) {
      console.error('Error fetching admin logs:', error);
      return [];
    }
  },

  async createLog(action: string, entityType: string, entityId?: string, details?: Record<string, any>): Promise<void> {
    try {
      // Pour le moment, on log juste dans la console
      console.log('Admin action logged:', {
        action,
        entityType,
        entityId,
        details,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error creating admin log:', error);
    }
  }
};
