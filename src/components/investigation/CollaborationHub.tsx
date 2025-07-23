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

interface CollaborationHubProps {
  quest: TreasureQuest;
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ quest }) => {
  const [message, setMessage] = useState('');
  const [activities, setActivities] = useState<any[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, number>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Simuler des données réelles
    setOnlineCount(Math.floor(Math.random() * 20) + 5);
    setActivities([
      {
        id: 1,
        user: 'Utilisateur A.',
        action: 'a ajouté un indice',
        time: 'Il y a 3 min',
        type: 'evidence',
        priority: 'medium'
      }
    ]);
    setLikes({ 1: 2 });
    setComments({ 1: 1 });
  }, []);

  const handleLike = (activityId: number) => {
    setLikes(prev => ({
      ...prev,
      [activityId]: (prev[activityId] || 0) + 1
    }));
    toast({
      title: "👍 J'aime ajouté",
      description: "Votre réaction a été enregistrée",
    });
  };

  const handleComment = (activityId: number) => {
    setComments(prev => ({
      ...prev,
      [activityId]: (prev[activityId] || 0) + 1
    }));
    toast({
      title: "💬 Commentaire ajouté",
      description: "Votre commentaire a été publié",
    });
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    toast({
      title: "✉️ Message envoyé",
      description: "Votre message a été partagé avec l'équipe",
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
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-800">{activity.user}</span>
                    <span className="text-slate-600">{activity.action}</span>
                    {activity.priority === 'high' && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Important
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-4">
                    <span>{activity.time}</span>
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
                      <button className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            <span className="text-slate-600 text-sm">{onlineCount} explorateurs en ligne</span>
          </div>
          <div className="space-y-2">
            {['Utilisateur A', 'Utilisateur B', 'Utilisateur C'].map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                <div className="relative">
                  <div className="w-6 h-6 bg-slate-300 rounded-full flex items-center justify-center">
                    <Users className="w-3 h-3 text-slate-600" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 text-sm">{user}</div>
                  <div className="text-slate-500 text-xs">Actif</div>
                </div>
              </div>
            ))}
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
          <h3 className="font-bold text-slate-800 mb-4">Progrès Collaboratif</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Indices analysés</span>
                <span className="text-slate-800 font-semibold">{quest.clues?.length || 0}/{(quest.clues?.length || 0) + 3}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-slate-600 h-2 rounded-full" 
                  style={{ width: `${Math.min(((quest.clues?.length || 0) / ((quest.clues?.length || 0) + 3)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Zones explorées</span>
                <span className="text-slate-800 font-semibold">3/8</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-slate-600 h-2 rounded-full" style={{ width: '37%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Validation IA</span>
                <span className="text-slate-800 font-semibold">En cours</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-slate-600 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CollaborationHub;