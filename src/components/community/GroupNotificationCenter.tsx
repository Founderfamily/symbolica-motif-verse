import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, BellOff, CheckCircle, MessageSquare, Heart, Users, AtSign } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupNotification } from '@/types/interest-groups';
import { getGroupNotifications, markNotificationAsRead } from '@/services/communityService';
import { toast } from 'sonner';

interface GroupNotificationCenterProps {
  groupId?: string;
  onNotificationRead?: (notificationId: string) => void;
}

const GroupNotificationCenter: React.FC<GroupNotificationCenterProps> = ({ 
  groupId, 
  onNotificationRead 
}) => {
  const [notifications, setNotifications] = useState<GroupNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth?.user) {
      loadNotifications();
    }
  }, [auth?.user, groupId]);

  const loadNotifications = async () => {
    if (!auth?.user) return;

    try {
      const notificationsData = await getGroupNotifications(auth.user.id);
      const filteredNotifications = groupId 
        ? notificationsData.filter(n => n.group_id === groupId)
        : notificationsData;
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    if (!auth?.user) return;

    setMarkingAsRead(notificationId);
    try {
      await markNotificationAsRead(notificationId, auth.user.id);
      
      // Update local state
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ));
      
      // Call callback if provided
      onNotificationRead?.(notificationId);
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    } finally {
      setMarkingAsRead(null);
    }
  };

  if (!auth?.user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BellOff className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-600">
            <I18nText translationKey="auth.loginRequired">Please log in to view notifications</I18nText>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <I18nText translationKey="community.notifications">Notifications</I18nText>
          {notifications.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {notifications.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-4 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <ScrollArea className="h-[300px]">
            <div className="space-y-1 p-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-3 hover:bg-slate-50 transition-colors ${notification.read ? 'bg-slate-50' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {notification.read ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Bell className="h-4 w-4 text-blue-500" />
                        )}
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                      </div>
                      <p className="text-sm text-slate-600">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markingAsRead === notification.id}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-6">
            <BellOff className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">
              <I18nText translationKey="community.noNotifications">No notifications yet</I18nText>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroupNotificationCenter;
