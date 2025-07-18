
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, MessageCircle, CheckCircle, Clock, User, Reply } from 'lucide-react';
import { I18nText } from '@/components/ui/i18n-text';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { ProfileNotification } from '@/types/contributions';

interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender?: {
    username: string;
    full_name: string;
  };
}

interface NotificationsAndMessagesProps {
  userId?: string;
}

const NotificationsAndMessages: React.FC<NotificationsAndMessagesProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const targetUserId = userId || user?.id;

  useEffect(() => {
    if (targetUserId) {
      loadNotifications();
      loadMessages();
    }
  }, [targetUserId]);

  const loadNotifications = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('group_notifications')
        .select(`
          *
        `)
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
    }
  };

  const loadMessages = async () => {
    if (!targetUserId) return;

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          profiles!direct_messages_sender_id_fkey (
            username,
            full_name
          )
        `)
        .eq('receiver_id', targetUserId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('group_notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la notification:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('direct_messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;

      setMessages(prev => 
        prev.map(m => m.id === messageId ? { ...m, read: true } : m)
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du message:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_post':
      case 'new_comment':
      case 'new_discovery':
      case 'new_discovery_comment':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMessages = messages.filter(m => !m.read).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Tabs defaultValue="notifications" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="notifications" className="flex items-center space-x-2">
          <Bell className="h-4 w-4" />
          <span>Notifications</span>
          {unreadNotifications > 0 && (
            <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
              {unreadNotifications}
            </Badge>
          )}
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center space-x-2">
          <MessageCircle className="h-4 w-4" />
          <span>Messages</span>
          {unreadMessages > 0 && (
            <Badge variant="destructive" className="ml-1 px-1 py-0 text-xs">
              {unreadMessages}
            </Badge>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="notifications">
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune notification pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-blue-200 bg-blue-50/30' : ''}`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(notification.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}</span>
                            {notification.profiles && (
                              <>
                                <span>•</span>
                                <div className="flex items-center space-x-1">
                                  <User className="h-3 w-3" />
                                  <span>{notification.profiles.full_name || notification.profiles.username}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markNotificationAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {notification.read && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="messages">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucun message pour le moment.</p>
              </CardContent>
            </Card>
          ) : (
            messages.map((message) => (
              <Card 
                key={message.id} 
                className={`hover:shadow-md transition-shadow ${!message.read ? 'border-blue-200 bg-blue-50/30' : ''}`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${!message.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                      <User className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {message.sender?.full_name || message.sender?.username || 'Utilisateur inconnu'}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{message.content}</p>
                          
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>{format(new Date(message.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Reply className="h-4 w-4" />
                          </Button>
                          {!message.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markMessageAsRead(message.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          {message.read && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default NotificationsAndMessages;
