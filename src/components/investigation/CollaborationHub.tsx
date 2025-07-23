import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle,
  Users,
  Heart,
  Camera,
  Send,
  Zap,
  Brain,
  Sparkles,
  Activity,
  Map,
  Eye,
  ThumbsUp
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { toast } from '@/hooks/use-toast';
import { useQuestChatSimple } from '@/hooks/useQuestChatSimple';
import { useQuestActivitiesSimple } from '@/hooks/useQuestActivitiesSimple';
import { useQuestParticipantsSimple } from '@/hooks/useQuestParticipantsSimple';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface CollaborationHubProps {
  quest: TreasureQuest;
}

export const CollaborationHub: React.FC<CollaborationHubProps> = ({ quest }) => {
  const [message, setMessage] = useState('');
  const [aiAnalysisOpen, setAiAnalysisOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, number>>({});

  // Hooks pour les données en temps réel (versions simplifiées)
  const { messages, sendMessage, isSending } = useQuestChatSimple(quest.id);
  const { activities, addActivity } = useQuestActivitiesSimple(quest.id);
  const { participants } = useQuestParticipantsSimple(quest.id);
  const aiAnalysis = useAIAnalysis();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Envoyer le message
    sendMessage(message);
    
    // Ajouter une activité correspondante
    addActivity({ 
      type: 'message', 
      data: { content: message.substring(0, 50) + '...' } 
    });
    
    setMessage('');
  };

  const handleAIAnalysis = async () => {
    try {
      const result = await aiAnalysis.mutateAsync({ 
        questId: quest.id, 
        analysisType: 'general' 
      });
      setCurrentAnalysis(result.analysis);
      setAiAnalysisOpen(true);
      
      // Ajouter une activité
      addActivity({ 
        type: 'ai_analysis', 
        data: { analysis_type: 'general' } 
      });
    } catch (error) {
      console.error('Erreur analyse IA:', error);
    }
  };

  const handleGenerateTheory = async () => {
    try {
      const result = await aiAnalysis.mutateAsync({ 
        questId: quest.id, 
        analysisType: 'theory' 
      });
      setCurrentAnalysis(result.analysis);
      setAiAnalysisOpen(true);
      
      // Ajouter une activité
      addActivity({ 
        type: 'theory', 
        data: { theory_type: 'ai_generated' } 
      });
    } catch (error) {
      console.error('Erreur génération théorie:', error);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatActivityContent = (activity: any) => {
    switch (activity.activity_type) {
      case 'message':
        return `a écrit un message dans le chat`;
      case 'evidence':
        return `a soumis une preuve`;
      case 'theory':
        return `a créé une nouvelle théorie`;
      case 'ai_analysis':
        return `a lancé une analyse IA`;
      default:
        return `a effectué une action`;
    }
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Live Activity Feed and Chat */}
      <div className="lg:col-span-2 space-y-6">
        {/* Live Activity Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Flux d'Activité en Direct
            </CardTitle>
            <Badge variant="secondary" className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              En direct
            </Badge>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune activité récente. Soyez le premier à contribuer !
                  </p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-background border">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.profiles?.avatar_url} />
                        <AvatarFallback>
                          {activity.profiles?.full_name?.[0] || activity.profiles?.username?.[0] || 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{activity.profiles?.full_name || activity.profiles?.username}</span>
                          <span className="text-muted-foreground">{formatActivityContent(activity)}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatTime(activity.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(activity.id)}
                            className="h-8 px-2 text-muted-foreground hover:text-red-500"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {likes[activity.id] || 0}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleComment(activity.id)}
                            className="h-8 px-2 text-muted-foreground hover:text-blue-500"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {comments[activity.id] || 0}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Real-time Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat en Temps Réel
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucun message. Commencez la conversation !
                  </p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.profiles?.avatar_url} />
                        <AvatarFallback>
                          {msg.profiles?.full_name?.[0] || msg.profiles?.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {msg.profiles?.full_name || msg.profiles?.username}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{msg.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            
            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                placeholder="Écrivez votre message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                className="flex-1 min-h-[40px] max-h-[120px]"
                rows={1}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!message.trim() || isSending}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 space-y-6">
        {/* Connected Explorers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Explorateurs Connectés ({participants.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {participants.length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucun explorateur connecté</p>
              ) : (
                participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={participant.profiles?.avatar_url} />
                        <AvatarFallback>
                          {participant.profiles?.full_name?.[0] || participant.profiles?.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        participant.status === 'active' ? 'bg-green-500' : 
                        participant.status === 'away' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {participant.profiles?.full_name || participant.profiles?.username || 'Utilisateur'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {participant.status === 'active' ? 'En ligne' : 
                         participant.status === 'away' ? 'Absent' : 'Hors ligne'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleAIAnalysis}
              disabled={aiAnalysis.isPending}
            >
              <Brain className="h-4 w-4 mr-2" />
              {aiAnalysis.isPending ? 'Analyse en cours...' : 'Analyse IA'}
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={handleGenerateTheory}
              disabled={aiAnalysis.isPending}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {aiAnalysis.isPending ? 'Génération...' : 'Générer Théorie IA'}
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Camera className="h-4 w-4 mr-2" />
              Partager une Preuve
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Map className="h-4 w-4 mr-2" />
              Voir la Carte
            </Button>
          </CardContent>
        </Card>

        {/* Quest Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progression de la Quête</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Indices disponibles</span>
                <Badge variant="secondary">{quest.clues?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Statut</span>
                <Badge 
                  variant={quest.status === 'active' ? 'default' : 'secondary'}
                >
                  {quest.status === 'active' ? 'Actif' : quest.status}
                </Badge>
              </div>
              {quest.clues && quest.clues.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Derniers indices :</span>
                  {quest.clues.slice(0, 3).map((clue, index) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded">
                      <span className="font-medium">{clue.title}</span>
                      <p className="text-xs text-muted-foreground mt-1">
                        {clue.description?.substring(0, 100)}...
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Dialog */}
      <Dialog open={aiAnalysisOpen} onOpenChange={setAiAnalysisOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Analyse IA de la Quête
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 pr-4">
              {currentAnalysis ? (
                <div className="prose prose-sm max-w-none">
                  {currentAnalysis.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 text-sm leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucune analyse disponible</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

