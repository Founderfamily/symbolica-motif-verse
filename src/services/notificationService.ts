import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'contribution' | 'community' | 'achievement' | 'system';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  entity_id?: string;
  entity_type?: string;
  created_at: string;
  updated_at: string;
}

// Interface for the actual database structure
interface NotificationRecord {
  id: string;
  user_id: string;
  type: string;
  content: any; // jsonb
  read: boolean;
  created_at: string;
}

export class NotificationService {
  // Get user notifications from the existing table structure
  static async getUserNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    if (!data) return [];

    return data.map(item => {
      const content = typeof item.content === 'string' ? JSON.parse(item.content) : item.content;
      return {
        id: item.id,
        type: item.type as Notification['type'],
        title: content?.title || 'Notification',
        message: content?.message || '',
        read: item.read,
        action_url: content?.action_url,
        entity_id: content?.entity_id,
        entity_type: content?.entity_type,
        created_at: item.created_at,
        updated_at: item.created_at // Use created_at as fallback
      };
    });
  }

  // Mark notification as read
  static async markAsRead(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }

    return true;
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }

    return true;
  }

  // Delete notification
  static async deleteNotification(notificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);

    if (error) {
      console.error('Error deleting notification:', error);
      return false;
    }

    return true;
  }

  // Create notification using direct insert to the current table structure
  static async createNotification(
    userId: string,
    type: Notification['type'],
    title: string,
    message: string,
    actionUrl?: string,
    entityId?: string,
    entityType?: string
  ): Promise<string | null> {
    try {
      const content = {
        title,
        message,
        action_url: actionUrl,
        entity_id: entityId,
        entity_type: entityType
      };

      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: type,
          content: content,
          read: false
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return null;
      }

      return data.id;
    } catch (err) {
      console.error('Error creating notification:', err);
      return null;
    }
  }

  // Get unread count
  static async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  }
}