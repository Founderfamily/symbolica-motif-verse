import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle,
  Users,
  Flame,
  TrendingUp,
  Clock,
  Heart,
  Share2,
  Camera,
  FileText,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Zap,
  Star,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CollaborationHubProps {
  quest: TreasureQuest;
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ quest }) => {
  const [message, setMessage] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadActivities();
    loadParticipants();
    joinQuest();
  }, [quest.id]);

  const loadActivities = async () => {
    // Pour l'instant, pas d'activités - suppression des fausses données
    setActivities([]);
  };

  const loadParticipants = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer le profil de l'utilisateur actuel
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .single();

      // Afficher seulement l'utilisateur actuel pour l'instant
      setParticipants([{
        id: user.id,
        profiles: profile,
        last_seen: new Date().toISOString(),
        status: 'active'
      }]);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  };

  const joinQuest = async () => {
    // Pas de base de données de participants pour l'instant
    console.log('User joined quest:', quest.id);
  };

  const handleLike = (activityId: string) => {
    setLikes(prev => ({
      ...prev,
      [activityId]: (prev[activityId] || 0) + 1
    }));
    toast({
      title: "👍 J'aime ajouté",
      description: "Votre réaction a été enregistrée",
    });
  };

  const handleComment = (activityId: string) => {
    setComments(prev => ({
      ...prev,
      [activityId]: (prev[activityId] || 0) + 1
    }));
    toast({
      title: "💬 Commentaire ajouté",
      description: "Votre commentaire a été publié",
    });
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    toast({
      title: "✉️ Message envoyé",
      description: "Votre message a été partagé",
    });
    setMessage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Live Activity Feed */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-6 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Flame className="w-5 h-5 text-slate-600" />
              Activité en Direct
            </h3>
            <Badge className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              LIVE
            </Badge>
          </div>

          <div className="space-y-4">
            {activities.length > 0 ? activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                  {activity.profiles?.avatar_url ? (
                    <img 
                      src={activity.profiles.avatar_url} 
                      alt={activity.profiles.full_name || activity.profiles.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-4 h-4 text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800">
                      {activity.profiles?.full_name || activity.profiles?.username || 'Utilisateur'}
                    </span>
                    <span className="text-slate-600">{activity.title}</span>
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-4">
                    <span>{new Date(activity.created_at).toLocaleString('fr-FR')}</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleLike(activity.id)}
                        className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {likes[activity.id] || 0}
                      </button>
                      <button 
                        onClick={() => handleComment(activity.id)}
                        className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        {comments[activity.id] || 0}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center p-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <p>Aucune activité récente</p>
                <p className="text-sm">Les interactions apparaîtront ici</p>
              </div>
            )}
          </div>

          {/* Quick Chat */}
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h4 className="font-semibold text-slate-800 mb-3">Chat Rapide</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Partager une idée, poser une question..."
                className="flex-1 p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              />
              <Button 
                onClick={handleSendMessage}
                className="bg-slate-800 hover:bg-slate-900 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                <Paperclip className="w-4 h-4 mr-1" />
                Fichier
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                <Camera className="w-4 h-4 mr-1" />
                Photo
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800">
                <Zap className="w-4 h-4 mr-1" />
                IA
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar - Online Users & Tools */}
      <div className="space-y-4">
        <Card className="p-4 bg-white border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-600" />
            Explorateurs Connectés
          </h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-slate-600 text-sm">{participants.length} explorateur{participants.length > 1 ? 's' : ''} en ligne</span>
          </div>
          <div className="space-y-2">
            {participants.length > 0 ? participants.map((participant) => (
              <div key={participant.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-slate-300 flex items-center justify-center">
                    {participant.profiles?.avatar_url ? (
                      <img 
                        src={participant.profiles.avatar_url} 
                        alt={participant.profiles.full_name || participant.profiles.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Users className="w-3 h-3 text-slate-600" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm">
                    {participant.profiles?.full_name || participant.profiles?.username || 'Utilisateur'}
                  </div>
                  <div className="text-slate-500 text-xs">En ligne</div>
                </div>
              </div>
            )) : (
              <div className="text-center p-4 text-slate-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">Vous êtes le premier</p>
                <p className="text-xs">D'autres explorateurs apparaîtront ici</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Actions Rapides</h3>
          <div className="space-y-2">
            <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">
              <Camera className="w-4 h-4 mr-2" />
              Partager Preuve
            </Button>
            <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Analyser avec IA
            </Button>
            <Button className="w-full bg-slate-800 hover:bg-slate-900 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Nouvelle Théorie
            </Button>
          </div>
        </Card>

        <Card className="p-4 bg-white border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4">Progrès de la Quête</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Indices disponibles</span>
                <span className="text-slate-800 font-semibold">{quest.clues?.length || 0}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-slate-600 h-2 rounded-full" 
                  style={{ width: quest.clues?.length ? '100%' : '0%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Statut</span>
                <span className="text-slate-800 font-semibold">{quest.status}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-slate-600 h-2 rounded-full" 
                  style={{ width: quest.status === 'active' ? '50%' : '0%' }}
                ></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CollaborationHub;