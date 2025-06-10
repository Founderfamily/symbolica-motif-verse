
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
  AlertCircle,
  Plus,
  Globe,
  FileText,
  Camera,
  Brain,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuestById, useQuestProgress } from '@/hooks/useQuests';
import HistoricalContextPanel from '@/components/quests/HistoricalContextPanel';
import InvestigationInterface from '@/components/investigation/InvestigationInterface';
import ContributeEvidenceDialog from '@/components/quests/ContributeEvidenceDialog';

const QuestDetailPage = () => {
  const { questId } = useParams<{ questId: string }>();
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'investigation'>('overview');
  
  // Ajout de logs de debug
  console.log('QuestDetailPage - questId from params:', questId);
  
  const { data: quest, isLoading, error } = useQuestById(questId!);
  const { data: progress } = useQuestProgress(questId!);

  // Ajout de logs de debug
  console.log('QuestDetailPage - quest data:', quest);
  console.log('QuestDetailPage - loading state:', isLoading);
  console.log('QuestDetailPage - error state:', error);

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
                Retour aux recherches
              </Button>
            </Link>
          </div>
          
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Erreur de chargement</h1>
            <p className="text-slate-600 mb-4">
              Impossible de charger les détails de cette recherche.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              ID de la recherche : {questId || 'non défini'}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/quests">
                <Button variant="outline">Retour aux recherches</Button>
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
          <p className="text-slate-600">Chargement de la recherche...</p>
          <p className="text-sm text-slate-500 mt-2">ID: {questId}</p>
        </div>
      </div>
    );
  }

  // Vérification si la recherche n'existe pas
  if (!quest) {
    console.warn('Quest not found for ID:', questId);
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link to="/quests">
              <Button variant="outline" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux recherches
              </Button>
            </Link>
          </div>
          
          <Card className="p-8 text-center">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Recherche introuvable</h1>
            <p className="text-slate-600 mb-4">
              Cette recherche n'existe pas ou n'est plus disponible.
            </p>
            <p className="text-sm text-slate-500 mb-6">
              ID recherché : {questId || 'non défini'}
            </p>
            <Link to="/quests">
              <Button className="bg-amber-600 hover:bg-amber-700">
                Découvrir d'autres recherches
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
              Retour aux recherches
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
            {/* En-tête de la recherche collaborative */}
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
                      {quest.status === 'active' ? 'Recherche Active' : 
                       quest.status === 'upcoming' ? 'À venir' : 
                       quest.status === 'completed' ? 'Résolue' : 'En pause'}
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
                    <Badge className="bg-blue-100 text-blue-800">
                      <Globe className="w-3 h-3 mr-1" />
                      Recherche Collaborative
                    </Badge>
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

                  {/* Panneau de contribution collaborative */}
                  <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Users className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-semibold text-blue-800">Recherche Collaborative Ouverte</h3>
                    </div>
                    <p className="text-blue-700 mb-4">
                      Cette recherche est ouverte à tous les contributeurs. Partagez vos découvertes, preuves, théories et liens d'archives 
                      pour faire avancer collectivement cette investigation historique.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-700">87</div>
                        <div className="text-sm text-green-600">Preuves</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-700">156</div>
                        <div className="text-sm text-purple-600">Contributeurs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-700">23</div>
                        <div className="text-sm text-orange-600">Théories</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-700">12</div>
                        <div className="text-sm text-red-600">Pistes Validées</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Panneau d'actions de contribution */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Informations</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <span className="text-slate-600">Recherche Mondiale</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span className="text-slate-600">{quest.reward_points} points de contribution</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Target className="w-5 h-5 text-green-500" />
                        <span className="text-slate-600">{totalClues} indices à découvrir</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-purple-500" />
                        <Badge className={`${
                          quest.difficulty_level === 'beginner' ? 'bg-green-100 text-green-800' :
                          quest.difficulty_level === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          quest.difficulty_level === 'expert' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {quest.difficulty_level === 'beginner' ? 'Accessible' :
                           quest.difficulty_level === 'intermediate' ? 'Intermédiaire' :
                           quest.difficulty_level === 'expert' ? 'Avancé' : 'Expert'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                  
                  {/* Actions de contribution */}
                  {quest.status === 'active' && (
                    <div className="space-y-3">
                      <ContributeEvidenceDialog questId={quest.id} className="w-full" />
                      
                      <Button 
                        onClick={() => setViewMode('investigation')}
                        variant="outline" 
                        className="w-full border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Interface d'Enquête
                      </Button>
                      
                      <Button variant="outline" className="w-full">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Discussions Communautaires
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contenu des indices et découvertes */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">Indices et Découvertes Collaboratives</h2>
              <div className="grid gap-4">
                {quest.clues?.slice(0, 3).map((clue, index) => {
                  const isCompleted = progress?.some(p => p.clue_index === index && p.validated);
                  
                  return (
                    <Card key={index} className={`p-4 ${
                      isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCompleted ? 'bg-green-500 text-white' : 'bg-amber-500 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{clue.title}</h3>
                          <p className="text-sm text-slate-600 line-clamp-1">{clue.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{clue.points} pts</Badge>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <FileText className="w-3 h-3" />
                            <span>24 preuves</span>
                          </div>
                        </div>
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
                    Voir toutes les découvertes dans l'interface d'enquête collaborative
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
