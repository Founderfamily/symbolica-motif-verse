import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bell, 
  Brain, 
  TrendingUp, 
  MapPin, 
  Users, 
  X,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AINotification {
  id: string;
  type: 'new_connection' | 'analysis_complete' | 'location_suggestion' | 'expert_needed' | 'verification_required';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  quest_id: string;
  metadata?: any;
  created_at: string;
  read: boolean;
  actionable: boolean;
}

interface AINotificationServiceProps {
  userId: string;
  questId?: string;
}

const AINotificationService: React.FC<AINotificationServiceProps> = ({ userId, questId }) => {
  const [notifications, setNotifications] = useState<AINotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
    // Simuler la réception de nouvelles notifications
    const interval = setInterval(checkForNewNotifications, 30000); // Vérifier toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, [userId, questId]);

  const loadNotifications = async () => {
    try {
      // TODO: Load real AI notifications from database
      setNotifications([]);
      setUnreadCount(0);
    } catch (error) {
      console.error('Erreur chargement notifications:', error);
    }
  };

  const checkForNewNotifications = async () => {
    // Simuler l'arrivée de nouvelles notifications
    const shouldAddNotification = Math.random() < 0.3; // 30% de chance
    
    if (shouldAddNotification) {
      const newNotification: AINotification = {
        id: `new_${Date.now()}`,
        type: 'verification_required',
        title: 'Vérification nécessaire',
        message: 'Nouvelles preuves à valider dans votre quête',
        priority: 'medium',
        quest_id: questId || '',
        metadata: { evidence_count: 2 },
        created_at: new Date().toISOString(),
        read: false,
        actionable: true
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Afficher un toast pour la nouvelle notification
      toast({
        title: newNotification.title,
        description: newNotification.message,
        action: (
          <Button size="sm" onClick={() => handleNotificationAction(newNotification)}>
            Voir
          </Button>
        ),
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const handleNotificationAction = (notification: AINotification) => {
    markAsRead(notification.id);
    
    // Actions spécifiques selon le type de notification
    switch (notification.type) {
      case 'new_connection':
        // Naviguer vers l'onglet Investigation IA
        console.log('Naviguer vers les connexions détectées');
        break;
      case 'location_suggestion':
        // Naviguer vers l'onglet Carte
        console.log('Ouvrir la carte avec le lieu suggéré');
        break;
      case 'analysis_complete':
        // Naviguer vers l'historique des analyses
        console.log('Ouvrir l\'analyse terminée');
        break;
      default:
        console.log('Action par défaut pour:', notification.type);
    }
  };

  const getNotificationIcon = (type: AINotification['type']) => {
    switch (type) {
      case 'new_connection': return <TrendingUp className="w-4 h-4 text-indigo-600" />;
      case 'analysis_complete': return <Brain className="w-4 h-4 text-green-600" />;
      case 'location_suggestion': return <MapPin className="w-4 h-4 text-blue-600" />;
      case 'expert_needed': return <Users className="w-4 h-4 text-purple-600" />;
      case 'verification_required': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return <Lightbulb className="w-4 h-4 text-slate-600" />;
    }
  };

  const getPriorityColor = (priority: AINotification['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-amber-500 bg-amber-50';
      case 'low': return 'border-l-green-500 bg-green-50';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}j`;
  };

  return (
    <div className="relative">
      {/* Bouton de notification */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panneau de notifications */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border border-slate-200 z-50 max-h-96 overflow-hidden">
          {/* En-tête */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Notifications IA
              </h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Tout lire
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setShowNotifications(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Aucune notification</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-l-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      getPriorityColor(notification.priority)
                    } ${!notification.read ? 'bg-blue-50/50' : ''}`}
                    onClick={() => handleNotificationAction(notification)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getNotificationIcon(notification.type)}
                        <h4 className="font-medium text-sm text-slate-800">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="p-1 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-slate-600 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTimeAgo(notification.created_at)}
                      </span>
                      {notification.actionable && (
                        <Badge variant="outline" className="text-xs">
                          Action possible
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AINotificationService;