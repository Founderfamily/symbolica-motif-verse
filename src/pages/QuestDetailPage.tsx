
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Clock, 
  Star, 
  MapPin, 
  Award,
  Target,
  CheckCircle,
  Lock,
  MessageCircle,
  Trophy,
  Flag,
  History,
  Search,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuestById, useQuestProgress, useJoinQuest } from '@/hooks/useQuests';
import HistoricalContextPanel from '@/components/quests/HistoricalContextPanel';
import InvestigationInterface from '@/components/investigation/InvestigationInterface';

const QuestDetailPage = () => {
  const { questId } = useParams<{ questId: string }>();
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'investigation'>('overview');
  
  // Ajout de logs de debug
  console.log('QuestDetailPage - questId from params:', questId);
  
  const { data: quest, isLoading, error } = useQuestById(questId!);
  const { data: progress } = useQuestProgress(questId!);
  const joinQuestMutation = useJoinQuest();

  // Ajout de logs de debug
  console.log('QuestDetailPage - quest data:', quest);
  console.log('QuestDetailPage - loading state:', isLoading);
  console.log('QuestDetailPage - error state:', error);

  const handleJoinQuest = async () => {
    if (!questId) return;
    try {
      console.log('Attempting to join quest:', questId);
      await joinQuestMutation.mutateAsync({ questId });
      // Basculer automatiquement vers l'interface d'enquête après inscription
      setViewMode('investigation');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  // Gestion d'erreur améliorée
  if (error) {
    console.error('Error loading quest:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/quests">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux quêtes
              </Button>
            </Link>
          </div>
          
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Erreur de chargement</h1>
            <p className="text-slate-600 mb-4">
              Impossible de charger les détails de cette quête.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              ID de la quête : {questId || 'non défini'}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/quests">
                <Button variant="outline">Retour aux quêtes</Button>
              </Link>
              <Button onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de la quête...</p>
          <p className="text-sm text-slate-500 mt-2">ID: {questId}</p>
        </div>
      </div>
    );
  }

  // Vérification si la quête n'existe pas
  if (!quest) {
    console.warn('Quest not found for ID:', questId);
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/quests">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux quêtes
              </Button>
            </Link>
          </div>
          
          <Card className="p-8 text-center">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Quête introuvable</h1>
            <p className="text-slate-600 mb-4">
              Cette quête n'existe pas ou n'est plus disponible.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              ID recherché : {questId || 'non défini'}
            </p>
            <Link to="/quests">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Découvrir d'autres quêtes
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const completedClues = progress?.filter(p => p.validated).length || 0;
  const totalClues = quest.clues?.length || 0;
  const progressPercentage = totalClues > 0 ? (completedClues / totalClues) * 100 : 0;

  const isHistoricalQuest = ['templar', 'lost_civilization', 'grail'].includes(quest.quest_type);

  console.log('QuestDetailPage - Rendering quest:', quest.title);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="mb-8">
          <Link to="/quests">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux quêtes
            </Button>
          </Link>
        </div>

        {/* Sélecteur de mode */}
        <div className="mb-8">
          <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'overview' | 'investigation')}>
            <TabsList className="bg-white/90 backdrop-blur-sm border border-amber-200/50">
              <TabsTrigger value="overview" className="px-6 py-3">
                <Flag className="w-4 h-4 mr-2" />
                Vue d'Ensemble
              </TabsTrigger>
              <TabsTrigger value="investigation" className="px-6 py-3">
                <Search className="w-4 h-4 mr-2" />
                Interface d'Enquête
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === 'overview' ? (
          <>
            {/* En-tête de la quête */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl mb-8">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4 mb-6">
                    <Badge className={`px-4 py-2 ${
                      quest.status === 'active' ? 'bg-green-100 text-green-800' :
                      quest.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      quest.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {quest.status === 'active' ? 'Active' : 
                       quest.status === 'upcoming' ? 'À venir' : 
                       quest.status === 'completed' ? 'Terminée' : 'Annulée'}
                    </Badge>
                    <Badge variant="outline">
                      {quest.quest_type === 'templar' ? 'Templiers' :
                       quest.quest_type === 'grail' ? 'Quête du Graal' :
                       quest.quest_type === 'lost_civilization' ? 'Civilisation Perdue' :
                       'Personnalisée'}
                    </Badge>
                    {isHistoricalQuest && (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        <History className="w-3 h-3 mr-1" />
                        Basé sur l'Histoire
                      </Badge>
                    )}
                  </div>
                  
                  <h1 className="text-4xl font-bold text-slate-800 mb-4">{quest.title}</h1>
                  <p className="text-lg text-slate-600 mb-6">{quest.description}</p>
                  
                  {/* Historical Context Panel for historical quests */}
                  {isHistoricalQuest && (
                    <div className="mb-6">
                      <HistoricalContextPanel
                        questType={quest.quest_type as 'templar' | 'lost_civilization' | 'graal'}
                        storyBackground={quest.story_background}
                      />
                    </div>
                  )}
                  
                  {quest.story_background && !isHistoricalQuest && (
                    <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
                      <h3 className="text-xl font-semibold text-amber-800 mb-3">Contexte Historique</h3>
                      <p className="text-amber-700">{quest.story_background}</p>
                    </div>
                  )}
                </div>
                
                {/* Panneau d'actions */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Informations</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-600">{quest.min_participants}-{quest.max_participants} participants</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span className="text-slate-600">{quest.reward_points} points</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-green-500" />
                        <span className="text-slate-600">{totalClues} indices</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-purple-500" />
                        <Badge className={`${
                          quest.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                          quest.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          quest.difficulty_level === 'expert' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {quest.difficulty_level === 'beginner' ? 'Débutant' :
                           quest.difficulty_level === 'intermediate' ? 'Intermédiaire' :
                           quest.difficulty_level === 'expert' ? 'Expert' : 'Maître'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Progression */}
                  {progress && progress.length > 0 && (
                    <Card className="p-6">
                      <h3 className="text-xl font-semibold mb-4">Votre Progression</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-slate-600 mb-2">
                            <span>Indices découverts</span>
                            <span>{completedClues}/{totalClues}</span>
                          </div>
                          <Progress value={progressPercentage} className="h-3" />
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-600">{Math.round(progressPercentage)}%</div>
                          <div className="text-sm text-slate-600">Complété</div>
                        </div>
                      </div>
                    </Card>
                  )}
                  
                  {/* Actions */}
                  {quest.status === 'active' && (
                    <div className="space-y-3">
                      <Button 
                        onClick={handleJoinQuest}
                        disabled={joinQuestMutation.isPending}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                      >
                        {joinQuestMutation.isPending ? 'Inscription...' : 'Rejoindre la Quête'}
                      </Button>
                      <Button 
                        onClick={() => setViewMode('investigation')}
                        variant="outline" 
                        className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Ouvrir l'Enquête
                      </Button>
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Chat d'équipe
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contenu simplifié des indices */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Indices de la Quête</h2>
              <div className="grid gap-4">
                {quest.clues?.slice(0, 3).map((clue, index) => {
                  const isCompleted = progress?.some(p => p.clue_index === index && p.validated);
                  const isUnlocked = index === 0 || progress?.some(p => p.clue_index === index - 1 && p.validated);
                  
                  return (
                    <Card key={index} className={`p-4 ${
                      isCompleted ? 'bg-green-50 border-green-200' :
                      isUnlocked ? 'bg-white' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCompleted ? 'bg-green-500 text-white' :
                          isUnlocked ? 'bg-amber-500 text-white' :
                          'bg-gray-300 text-gray-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{clue.title}</h3>
                          <p className="text-sm text-slate-600 line-clamp-1">{clue.description}</p>
                        </div>
                        <Badge variant="outline">{clue.points} pts</Badge>
                      </div>
                    </Card>
                  );
                })}
                {quest.clues && quest.clues.length > 3 && (
                  <Button 
                    variant="outline" 
                    onClick={() => setViewMode('investigation')}
                    className="w-full"
                  >
                    Voir tous les indices dans l'interface d'enquête
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          <InvestigationInterface quest={quest} />
        )}
      </div>
    </div>
  );
};

export default QuestDetailPage;
