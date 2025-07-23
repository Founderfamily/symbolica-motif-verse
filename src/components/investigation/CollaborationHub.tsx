import React, { useState } from 'react';
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

interface CollaborationHubProps {
  quest: TreasureQuest;
}

const CollaborationHub: React.FC<CollaborationHubProps> = ({ quest }) => {
  const [message, setMessage] = useState('');

  const liveActivities = [
    {
      id: 1,
      user: 'Marie L.',
      action: 'a partagé une nouvelle preuve',
      time: 'Il y a 2 min',
      type: 'evidence',
      avatar: '👩‍🔬',
      priority: 'high'
    },
    {
      id: 2,
      user: 'Dr. Bernard',
      action: 'a validé une théorie',
      time: 'Il y a 5 min',
      type: 'theory',
      avatar: '👨‍💼',
      priority: 'medium'
    },
    {
      id: 3,
      user: 'Alexandre T.',
      action: 'a découvert un lieu',
      time: 'Il y a 8 min',
      type: 'location',
      avatar: '🗺️',
      priority: 'high'
    }
  ];

  const onlineUsers = [
    { name: 'Marie L.', status: 'Analyse en cours', avatar: '👩‍🔬' },
    { name: 'Dr. Bernard', status: 'Vérifie archives', avatar: '👨‍💼' },
    { name: 'Alex T.', status: 'Sur le terrain', avatar: '🗺️' },
    { name: 'Sophie M.', status: 'Recherche IA', avatar: '🤖' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Live Activity Feed */}
      <div className="lg:col-span-2 space-y-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Flame className="w-5 h-5" />
              Activité en Direct
            </h3>
            <Badge className="bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              LIVE
            </Badge>
          </div>

          <div className="space-y-4">
            {liveActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                <div className="text-2xl">{activity.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-blue-800">{activity.user}</span>
                    <span className="text-blue-600">{activity.action}</span>
                    {activity.priority === 'high' && (
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        Important
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-blue-500 flex items-center gap-4">
                    <span>{activity.time}</span>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 hover:text-blue-700">
                        <ThumbsUp className="w-3 h-3" />
                        12
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-700">
                        <MessageCircle className="w-3 h-3" />
                        3
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-700">
                        <Share2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Chat */}
          <div className="mt-6 p-4 bg-white rounded-xl border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-3">Chat Rapide</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Partager une idée, poser une question..."
                className="flex-1 p-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-4 h-4 mr-1" />
                Fichier
              </Button>
              <Button variant="ghost" size="sm">
                <Camera className="w-4 h-4 mr-1" />
                Photo
              </Button>
              <Button variant="ghost" size="sm">
                <Zap className="w-4 h-4 mr-1" />
                IA
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Sidebar - Online Users & Tools */}
      <div className="space-y-4">
        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Explorateurs Connectés
          </h3>
          <div className="space-y-3">
            {onlineUsers.map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-green-100">
                <div className="relative">
                  <span className="text-lg">{user.avatar}</span>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-green-800 text-sm">{user.name}</div>
                  <div className="text-green-600 text-xs truncate">{user.status}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <h3 className="font-bold text-amber-800 mb-4">Actions Rapides</h3>
          <div className="space-y-2">
            <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white">
              <Camera className="w-4 h-4 mr-2" />
              Partager Preuve
            </Button>
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <Zap className="w-4 h-4 mr-2" />
              Analyser avec IA
            </Button>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Nouvelle Théorie
            </Button>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <h3 className="font-bold text-purple-800 mb-4">Progrès Collaboratif</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-700">Indices analysés</span>
                <span className="text-purple-800 font-semibold">67%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '67%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-700">Zones explorées</span>
                <span className="text-purple-800 font-semibold">45%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-purple-700">Validation IA</span>
                <span className="text-purple-800 font-semibold">82%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CollaborationHub;