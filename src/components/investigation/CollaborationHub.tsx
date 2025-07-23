import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Heart,
  Camera,
  Brain,
  Sparkles,
  Activity,
  Map,
  Users,
  MessageCircle
} from 'lucide-react';
import { TreasureQuest } from '@/types/quests';
import { toast } from '@/hooks/use-toast';
import { useQuestParticipantsSimple } from '@/hooks/useQuestParticipantsSimple';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import QuestChat from './QuestChat';

interface CollaborationHubProps {
  quest: TreasureQuest;
}

export const CollaborationHub: React.FC<CollaborationHubProps> = ({ quest }) => {
  const [aiAnalysisOpen, setAiAnalysisOpen] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string>('');
  const [activities] = useState<any[]>([]); // Sera implémenté plus tard

  // Hooks pour les données en temps réel
  const { participants } = useQuestParticipantsSimple(quest.id);
  const aiAnalysis = useAIAnalysis();

  const handleAIAnalysis = async () => {
    try {
      const result = await aiAnalysis.mutateAsync({ 
        questId: quest.id, 
        analysisType: 'general' 
      });
      setCurrentAnalysis(result.analysis);
      setAiAnalysisOpen(true);
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
            <ScrollArea className="h-60">
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
                          <span className="text-muted-foreground">{activity.title}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatTime(activity.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-red-500"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            0
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-muted-foreground hover:text-blue-500"
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            0
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

        <Separator />

        {/* Quest Chat - Composant séparé */}
        <QuestChat questId={quest.id} questName={quest.title} />
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