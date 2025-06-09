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
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuestById, useQuestProgress, useJoinQuest } from '@/hooks/useQuests';
import HistoricalContextPanel from '@/components/quests/HistoricalContextPanel';

const QuestDetailPage = () => {
  const { questId } = useParams<{ questId: string }>();
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  
  const { data: quest, isLoading } = useQuestById(questId!);
  const { data: progress } = useQuestProgress(questId!);
  const joinQuestMutation = useJoinQuest();

  const handleJoinQuest = async () => {
    if (!questId) return;
    try {
      await joinQuestMutation.mutateAsync({ questId });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
    }
  };

  if (isLoading || !quest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de la quête...</p>
        </div>
      </div>
    );
  }

  const completedClues = progress?.filter(p => p.validated).length || 0;
  const totalClues = quest.clues?.length || 0;
  const progressPercentage = totalClues > 0 ? (completedClues / totalClues) * 100 : 0;

  const isHistoricalQuest = ['templar', 'lost_civilization', 'grail'].includes(quest.quest_type);

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
                    questType={quest.quest_type as 'templar' | 'lost_civilization' | 'grail'}
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
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Chat d'équipe
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="clues" className="space-y-8">
          <TabsList className="bg-white/90 backdrop-blur-sm p-2 rounded-2xl border border-amber-200/50">
            <TabsTrigger value="clues" className="px-6 py-3">Indices</TabsTrigger>
            <TabsTrigger value="teams" className="px-6 py-3">Équipes</TabsTrigger>
            <TabsTrigger value="leaderboard" className="px-6 py-3">Classement</TabsTrigger>
            <TabsTrigger value="rewards" className="px-6 py-3">Récompenses</TabsTrigger>
          </TabsList>

          <TabsContent value="clues">
            <div className="grid gap-6">
              {quest.clues?.map((clue, index) => {
                const isCompleted = progress?.some(p => p.clue_index === index && p.validated);
                const isUnlocked = index === 0 || progress?.some(p => p.clue_index === index - 1 && p.validated);
                
                return (
                  <Card key={index} className={`p-6 transition-all duration-300 ${
                    isCompleted ? 'bg-green-50 border-green-200' :
                    isUnlocked ? 'bg-white hover:shadow-lg' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-green-500 text-white' :
                        isUnlocked ? 'bg-amber-500 text-white' :
                        'bg-gray-300 text-gray-500'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                         isUnlocked ? <Flag className="w-5 h-5" /> :
                         <Lock className="w-5 h-5" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-semibold">
                            Indice {index + 1}: {clue.title}
                          </h3>
                          <Badge variant="outline">
                            {clue.points} points
                          </Badge>
                        </div>
                        
                        {isUnlocked ? (
                          <div className="space-y-4">
                            <p className="text-slate-600">{clue.description}</p>
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="font-medium text-amber-800">Indice</span>
                              </div>
                              <p className="text-amber-700">{clue.hint}</p>
                            </div>
                            
                            {clue.location && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <MapPin className="w-4 h-4" />
                                <span>Zone géographique définie ({clue.location.radius}m de rayon)</span>
                              </div>
                            )}
                            
                            {!isCompleted && (
                              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                                Valider la découverte
                              </Button>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">
                            Cet indice sera débloqué une fois l'indice précédent résolu.
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="teams">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Équipes Participantes</h2>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Les équipes seront affichées ici une fois la quête commencée.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Classement</h2>
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">Le classement sera disponible une fois la quête en cours.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rewards">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Récompenses</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-8 h-8 text-amber-500" />
                    <h3 className="text-xl font-semibold">Récompenses de Base</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Points de quête:</span>
                      <span className="font-semibold">{quest.reward_points}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Badge de completion:</span>
                      <span className="font-semibold">"{quest.title} Master"</span>
                    </div>
                  </div>
                </Card>
                
                {quest.special_rewards && quest.special_rewards.length > 0 && (
                  <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Trophy className="w-8 h-8 text-purple-500" />
                      <h3 className="text-xl font-semibold">Récompenses Spéciales</h3>
                    </div>
                    <div className="space-y-3">
                      {quest.special_rewards.map((reward, index) => (
                        <div key={index} className="text-purple-700">
                          • {reward.name || reward.description}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestDetailPage;
