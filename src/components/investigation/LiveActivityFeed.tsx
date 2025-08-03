
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Activity,
  MessageCircle,
  Camera,
  Brain,
  MapPin,
  FileText,
  Users,
  Clock,
  Upload,
  MessageSquareText
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'evidence' | 'chat_message' | 'user_join' | 'theory' | 'clue_discovery';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  questId: string;
  metadata?: {
    evidenceType?: string;
    location?: string;
    messageType?: string;
  };
}

interface LiveActivityFeedProps {
  questId: string;
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ questId }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadActivities = async () => {
    if (!questId) return;
    
    setLoading(true);
    try {
      // Charger les preuves soumises
      const { data: evidenceData } = await supabase
        .from('quest_evidence')
        .select('id, title, description, evidence_type, created_at, submitted_by')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Charger les messages de chat récents
      const { data: chatData } = await supabase
        .from('quest_chat_messages')
        .select('id, content, created_at, user_id')
        .eq('quest_id', questId)
        .order('created_at', { ascending: false })
        .limit(10);

      // Récupérer les profils des utilisateurs
      const userIds = new Set<string>();
      evidenceData?.forEach(e => userIds.add(e.submitted_by));
      chatData?.forEach(m => userIds.add(m.user_id));

      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', Array.from(userIds));

      // Créer un map des profils pour un accès rapide
      const profilesMap = new Map();
      profilesData?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      // Combiner et formater les activités
      const allActivities: ActivityItem[] = [];

      // Ajouter les preuves
      evidenceData?.forEach(evidence => {
        const profile = profilesMap.get(evidence.submitted_by);
        allActivities.push({
          id: evidence.id,
          type: 'evidence',
          user: {
            id: evidence.submitted_by,
            name: profile?.full_name || profile?.username || 'Utilisateur inconnu',
            avatar: profile?.avatar_url || undefined
          },
          content: `${evidence.title}${evidence.description ? ': ' + evidence.description : ''}`,
          timestamp: evidence.created_at,
          questId,
          metadata: {
            evidenceType: evidence.evidence_type
          }
        });
      });

      // Ajouter les messages de chat
      chatData?.forEach(message => {
        const profile = profilesMap.get(message.user_id);
        allActivities.push({
          id: message.id,
          type: 'chat_message',
          user: {
            id: message.user_id,
            name: profile?.full_name || profile?.username || 'Utilisateur inconnu',
            avatar: profile?.avatar_url || undefined
          },
          content: message.content,
          timestamp: message.created_at,
          questId
        });
      });

      // Trier par timestamp descendant
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(allActivities.slice(0, 15)); // Garder les 15 plus récentes
    } catch (error) {
      console.error('Erreur lors du chargement des activités:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();

    // Écouter les nouvelles activités en temps réel
    const evidenceChannel = supabase
      .channel(`quest_evidence_${questId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'quest_evidence',
        filter: `quest_id=eq.${questId}`
      }, () => {
        loadActivities();
      })
      .subscribe();

    const chatChannel = supabase
      .channel(`quest_chat_${questId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'quest_chat_messages',
        filter: `quest_id=eq.${questId}`
      }, () => {
        loadActivities();
      })
      .subscribe();

    return () => {
      evidenceChannel.unsubscribe();
      chatChannel.unsubscribe();
    };
  }, [questId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'chat_message': return <MessageSquareText className="w-4 h-4 text-blue-500" />;
      case 'evidence': return <Upload className="w-4 h-4 text-green-500" />;
      case 'theory': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'clue_discovery': return <MapPin className="w-4 h-4 text-red-500" />;
      case 'user_join': return <Users className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'chat_message': return 'a envoyé un message';
      case 'evidence': return 'a soumis une preuve';
      case 'theory': return 'a proposé une théorie';
      case 'clue_discovery': return 'a découvert un indice';
      case 'user_join': return 'a rejoint l\'enquête';
      default: return 'a effectué une action';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activité en Direct
        </CardTitle>
        <Badge variant="secondary" className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          En direct
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="space-y-4 p-4">
            {loading ? (
              <div className="text-center py-8">
                <Activity className="w-8 h-8 mx-auto mb-4 animate-spin text-blue-500" />
                <p className="text-muted-foreground">Chargement des activités...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune activité récente.</p>
                <p className="text-sm mt-2">Soyez le premier à contribuer à cette enquête !</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-background border hover:bg-muted/30 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback className="text-xs">
                          {activity.user.name[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{activity.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {getActivityTypeLabel(activity.type)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-1 line-clamp-2">
                      {activity.content}
                    </p>
                    {activity.metadata?.evidenceType && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {activity.metadata.evidenceType}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LiveActivityFeed;
