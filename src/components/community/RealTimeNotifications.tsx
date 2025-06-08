
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell, Share2, MessageCircle, Heart } from 'lucide-react';

const RealTimeNotifications: React.FC = () => {
  const auth = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!auth?.user) return;

    console.log('🔔 Setting up real-time notifications for user:', auth.user.id);

    // Écouter les nouvelles notifications
    const channel = supabase
      .channel('group-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_notifications',
          filter: `user_id=eq.${auth.user.id}`
        },
        (payload) => {
          console.log('🔔 New notification received:', payload);
          const notification = payload.new;
          
          // Déterminer l'icône basée sur le type de notification
          let icon = <Bell className="h-4 w-4" />;
          switch (notification.notification_type) {
            case 'new_discovery':
              icon = <Share2 className="h-4 w-4" />;
              break;
            case 'new_discovery_comment':
              icon = <MessageCircle className="h-4 w-4" />;
              break;
            case 'discovery_like':
              icon = <Heart className="h-4 w-4" />;
              break;
            case 'new_post':
              icon = <MessageCircle className="h-4 w-4" />;
              break;
            case 'new_comment':
              icon = <MessageCircle className="h-4 w-4" />;
              break;
            default:
              icon = <Bell className="h-4 w-4" />;
          }
          
          // Afficher un toast pour la nouvelle notification
          toast(notification.title, {
            description: notification.message,
            icon: icon,
            action: {
              label: 'View',
              onClick: () => {
                // Naviguer vers la notification ou le groupe
                window.location.href = `/community`;
              }
            }
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_posts',
        },
        (payload) => {
          console.log('📝 New post created:', payload);
          // Les notifications sont créées automatiquement par le trigger
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_comments',
        },
        (payload) => {
          console.log('💬 New comment created:', payload);
          // Les notifications sont créées automatiquement par le trigger
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_discoveries',
        },
        (payload) => {
          console.log('🔍 New discovery shared:', payload);
          // Les notifications sont créées automatiquement par le trigger
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'discovery_comments',
        },
        (payload) => {
          console.log('💬 New discovery comment created:', payload);
          // Les notifications sont créées automatiquement par le trigger
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_invitations',
          filter: `invited_user_id=eq.${auth.user.id}`
        },
        (payload) => {
          console.log('📨 New invitation received:', payload);
          toast('New Group Invitation', {
            description: 'You have received a new group invitation!',
            icon: <Bell className="h-4 w-4" />,
            action: {
              label: 'View',
              onClick: () => {
                window.location.href = `/community`;
              }
            }
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Real-time subscription status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      console.log('🔌 Cleaning up real-time subscription');
      supabase.removeChannel(channel);
      setIsConnected(false);
    };
  }, [auth?.user]);

  // Composant invisible qui gère juste les notifications en temps réel
  return null;
};

export default RealTimeNotifications;
