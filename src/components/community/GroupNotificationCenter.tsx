
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Heart, MessageCircle, Users, Mail, AtSign, Check, X } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { GroupNotification } from '@/types/interest-groups';
import { getGroupNotifications, markNotificationAsRead } from '@/services/communityService';
import { toast } from 'sonner';

const GroupNotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<GroupNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const auth = useAuth();

  useEffect(() => {
    if (auth?.user) {
      loadNotifications();
    }
  }, [auth?.user]);

  const loadNotifications = async () => {
    if (!auth?.user) return;

    try {
      const notificationsData = await getGroupNotifications(auth.user.id);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_post':
        return <MessageCircle className="h-4 w-4" />;
      case 'new_comment':
      case 'reply':
        return <MessageCircle className="h-4 w-4" />;
      case 'like':
        return <Heart className="h-4 w-4" />;
      case 'new_member':
        return <Users className="h-4 w-4" />;
      case 'invitation':
        return <Mail className="h-4 w-4" />;
      case 'mention':
        return <AtSign className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'text-red-500';
      case 'new_member':
        return 'text-blue-500';
      case 'invitation':
        return 'text-purple-500';
      case 'mention':
        return 'text-orange-500';
      default:
        return 'text-slate-500';
    }
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || (filter === 'unread' && !notif.read)
  );

  const unreadCount = notifications.filter(notif => !notif.read).length;

  if (!auth?.user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <I18nText translationKey="community.notifications">Notifications</I18nText>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              <I18nText translationKey="common.all">All</I18nText>
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              <I18nText translationKey="community.unread">Unread</I18nText>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-6">
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-3 animate-pulse">
                    <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {filteredNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`p-4 hover:bg-slate-50 transition-colors ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex space-x-3">
                    <div className={`mt-1 ${getNotificationColor(notification.notification_type)}`}>
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm text-slate-900">
                            {notification.title}
                          </p>
                          <p className="text-sm text-slate-600 mt-1">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-2 mt-2">
                            {notification.group && (
                              <Badge variant="outline" className="text-xs">
                                {notification.group.name}
                              </Badge>
                            )}
                            <span className="text-xs text-slate-500">
                              {new Date(notification.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="ml-2 h-6 w-6 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">
                {filter === 'unread' ? (
                  <I18nText translationKey="community.noUnreadNotifications">
                    No unread notifications
                  </I18nText>
                ) : (
                  <I18nText translationKey="community.noNotifications">
                    No notifications yet
                  </I18nText>
                )}
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GroupNotificationCenter;
