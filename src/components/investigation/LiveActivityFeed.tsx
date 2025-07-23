
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity,
  MessageCircle,
  Camera,
  Brain,
  MapPin,
  FileText,
  Users,
  Clock
} from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'message' | 'evidence' | 'theory' | 'clue_discovery' | 'user_join';
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  questId: string;
}

interface LiveActivityFeedProps {
  questId: string;
}

const LiveActivityFeed: React.FC<LiveActivityFeedProps> = ({ questId }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Simuler des activités en temps réel
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'evidence',
        user: { id: 'user-1', name: 'Marie Dubois' },
        content: 'a partagé une nouvelle preuve photographique',
        timestamp: new Date(Date.now() - 120000).toISOString(),
        questId
      },
      {
        id: '2',
        type: 'message',
        user: { id: 'user-2', name: 'Jean Martin' },
        content: 'a posté un message dans le chat',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        questId
      },
      {
        id: '3',
        type: 'theory',
        user: { id: 'user-3', name: 'Sophie Legrand' },
        content: 'a proposé une nouvelle théorie',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        questId
      },
      {
        id: '4',
        type: 'user_join',
        user: { id: 'user-4', name: 'Pierre Durand' },
        content: 'a rejoint la quête',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        questId
      }
    ];

    setActivities(mockActivities);
  }, [questId]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageCircle className="w-4 h-4 text-blue-500" />;
      case 'evidence': return <Camera className="w-4 h-4 text-green-500" />;
      case 'theory': return <Brain className="w-4 h-4 text-purple-500" />;
      case 'clue_discovery': return <MapPin className="w-4 h-4 text-red-500" />;
      case 'user_join': return <Users className="w-4 h-4 text-orange-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
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
            {activities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Aucune activité récente.</p>
                <p className="text-sm mt-2">Les nouvelles actions apparaîtront ici en temps réel.</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback className="text-xs">
                          {activity.user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{activity.user.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{activity.content}</p>
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
