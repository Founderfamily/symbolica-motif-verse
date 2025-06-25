
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Clock, 
  Trophy, 
  Star,
  FileText,
  MessageSquare,
  Camera,
  Search,
  CheckCircle,
  AlertTriangle,
  Plus,
  Calendar,
  Target,
  Compass,
  History,
  BookOpen,
  Eye,
  ThumbsUp,
  Share2,
  Flag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuests } from '@/hooks/useQuests';
import { TreasureQuest } from '@/types/quests';
import InvestigationInterface from '@/components/investigation/InvestigationInterface';
import { normalizeQuestClues, getQuestCluesPreview, getQuestCluesCount } from '@/utils/questUtils';

const QuestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: allQuests, isLoading, error } = useQuests();
  const [activeTab, setActiveTab] = useState('overview');
  
  console.log('QuestDetailPage - Quest ID from params:', id);
  console.log('QuestDetailPage - All quests loaded:', allQuests?.length || 0);
  
  if (allQuests) {
    console.log('QuestDetailPage - Available quest IDs:', allQuests.map(q => ({ id: q.id, title: q.title })));
  }

  // Trouver la quête par ID avec meilleur diagnostic
  const quest = allQuests?.find(q => {
    console.log('QuestDetailPage - Comparing:', q.id, 'vs', id, 'match:', q.id === id);
    return q.id === id;
  });
  
  console.log('QuestDetailPage - Found quest:', quest ? quest.title : 'QUEST NOT FOUND');
  console.log('QuestDetailPage - Quest object:', quest);

  // Normaliser les clues de manière sécurisée - CORRECTION: passer seulement quest.clues
  const questClues = quest ? normalizeQuestClues(quest.clues) : [];
  const questCluesCount = quest ? getQuestCluesCount(quest) : 0;
  // CORRECTION: passer seulement quest, pas quest et 3
  const questCluesPreview = quest ? getQuestCluesPreview(quest).slice(0, 3) : [];

  console.log('QuestDetailPage - Normalized clues:', questClues);
  console.log('QuestDetailPage - Clues count:', questCluesCount);
  console.log('QuestDetailPage - Clues preview:', questCluesPreview);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de la quête...</p>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('QuestDetailPage - Error loading quests:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Erreur de chargement</h1>
            <p className="text-slate-600 mb-4">Impossible de charger les détails de la quête.</p>
            <p className="text-sm text-slate-500 mb-6">
              Erreur: {error instanceof Error ? error.message : 'Erreur inconnue'}
            </p>
            <div className="space-y-4">
              <Link to="/quests">
                <Button>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux quêtes
                </Button>
              </Link>
              <Button onClick={() => window.location.reload()} variant="outline">
                Réessayer
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!quest) {
    console.warn('QuestDetailPage - Quest not found. ID searched:', id);
    console.warn('QuestDetailPage - Available IDs:', allQuests?.map(q => q.id));
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <Search className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Quête introuvable</h1>
            <p className="text-slate-600 mb-4">La quête demandée n'existe pas ou n'est pas disponible.</p>
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-slate-500 mb-2">Détails de débogage :</p>
              <p className="text-xs text-slate-400">ID recherché : {id}</p>
              <p className="text-xs text-slate-400">Quêtes disponibles : {allQuests?.length || 0}</p>
              {allQuests && allQuests.length > 0 && (
                <details className="mt-2">
                  <summary className="text-xs text-slate-400 cursor-pointer">IDs disponibles</summary>
                  <div className="mt-1 text-xs text-slate-300 max-h-32 overflow-auto">
                    {allQuests.map(q => (
                      <div key={q.id}>{q.id} - {q.title}</div>
                    ))}
                  </div>
                </details>
              )}
            </div>
            <Link to="/quests">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour aux quêtes
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  console.log('QuestDetailPage - Successfully rendering quest:', quest.title);

  const questTypeLabels = {
    templar: 'Templiers',
    lost_civilization: 'Civilisation Perdue',
    graal: 'Quête du Graal',
    custom: 'Personnalisée'
  };

  const difficultyColors = {
    beginner: 'bg-amber-50 text-amber-800 border-amber-200',
    intermediate: 'bg-amber-100 text-amber-900 border-amber-300',
    expert: 'bg-stone-100 text-stone-800 border-stone-300',
    master: 'bg-stone-200 text-stone-900 border-stone-400'
  };

  const difficultyLabels = {
    beginner: 'Accessible',
    intermediate: 'Intermédiaire',
    expert: 'Avancé',
    master: 'Expert'
  };

  const statusColors = {
    upcoming: 'bg-amber-100 text-amber-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-stone-100 text-stone-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const statusLabels = {
    upcoming: 'À venir',
    active: 'Active',
    completed: 'Terminée',
    cancelled: 'Annulée'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* En-tête avec navigation */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/quests" className="flex items-center text-stone-600 hover:text-stone-800 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux quêtes
            </Link>
            
            <div className="flex items-center gap-3">
              <Badge className={statusColors[quest.status]}>
                {statusLabels[quest.status]}
              </Badge>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Observer
                </Button>
                <Button size="sm" className="bg-stone-800 hover:bg-stone-900 text-amber-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Rejoindre
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête de la quête */}
        <div className="mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/50 shadow-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Informations principales */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={difficultyColors[quest.difficulty_level]}>
                    {difficultyLabels[quest.difficulty_level]}
                  </Badge>
                  <Badge variant="secondary" className="bg-stone-100 text-stone-700">
                    {questTypeLabels[quest.quest_type]}
                  </Badge>
                </div>
                
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-stone-800 to-amber-700 bg-clip-text text-transparent">
                  {quest.title}
                </h1>
                
                <p className="text-xl text-stone-600 mb-6 leading-relaxed">
                  {quest.description}
                </p>

                {quest.story_background && (
                  <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-400 mb-6">
                    <h3 className="font-semibold text-amber-800 mb-2">Contexte historique</h3>
                    <p className="text-amber-700 text-sm leading-relaxed">
                      {quest.story_background}
                    </p>
                  </div>
                )}

                {/* Métriques de participation */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <Users className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-800">127</div>
                    <div className="text-sm text-amber-600">Participants</div>
                  </div>
                  <div className="bg-stone-50 rounded-lg p-4 text-center">
                    <FileText className="w-6 h-6 text-stone-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-stone-800">{questCluesCount}</div>
                    <div className="text-sm text-stone-600">Indices</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <Camera className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-amber-800">89</div>
                    <div className="text-sm text-amber-600">Preuves</div>
                  </div>
                  <div className="bg-stone-50 rounded-lg p-4 text-center">
                    <MessageSquare className="w-6 h-6 text-stone-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-stone-800">234</div>
                    <div className="text-sm text-stone-600">Discussions</div>
                  </div>
                </div>
              </div>

              {/* Sidebar avec détails */}
              <div className="space-y-6">
                <Card className="p-6 bg-gradient-to-br from-stone-50 to-amber-50 border-stone-200">
                  <h3 className="font-semibold text-stone-800 mb-4">Détails de la quête</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-5 h-5 text-amber-600" />
                      <div>
                        <div className="text-sm text-stone-600">Récompense</div>
                        <div className="font-semibold text-stone-800">{quest.reward_points} points</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-stone-600" />
                      <div>
                        <div className="text-sm text-stone-600">Participants</div>
                        <div className="font-semibold text-stone-800">{quest.min_participants}-{quest.max_participants}</div>
                      </div>
                    </div>
                    
                    {quest.start_date && (
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-stone-600" />
                        <div>
                          <div className="text-sm text-stone-600">Début</div>
                          <div className="font-semibold text-stone-800">
                            {new Date(quest.start_date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {quest.end_date && (
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-stone-600" />
                        <div>
                          <div className="text-sm text-stone-600">Fin</div>
                          <div className="font-semibold text-stone-800">
                            {new Date(quest.end_date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Actions rapides */}
                <Card className="p-6">
                  <h3 className="font-semibold text-stone-800 mb-4">Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full bg-stone-800 hover:bg-stone-900 text-amber-100">
                      <Plus className="w-4 h-4 mr-2" />
                      Rejoindre la quête
                    </Button>
                    <Button variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Suivre
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Partager
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="clues">Indices</TabsTrigger>
            <TabsTrigger value="evidence">Preuves</TabsTrigger>
            <TabsTrigger value="theories">Théories</TabsTrigger>
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="investigation">Investigation</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Progression des indices */}
              <Card className="p-6 bg-white/95 backdrop-blur-sm border border-amber-200/50">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" />
                  Progression des indices
                </h3>
                
                {questCluesPreview.length > 0 ? (
                  <div className="space-y-3">
                    {/* CORRECTION: S'assurer que questCluesPreview est un array avant d'utiliser map */}
                    {Array.isArray(questCluesPreview) && questCluesPreview.map((clue, index) => (
                      <div key={clue.id || index} className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                        <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-stone-800">{clue.title}</div>
                          <div className="text-sm text-stone-600">{clue.description}</div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Résolu
                        </Badge>
                      </div>
                    ))}
                    
                    {questCluesCount > 3 && (
                      <div className="text-center pt-3">
                        <Button variant="outline" onClick={() => setActiveTab('clues')}>
                          Voir tous les indices ({questCluesCount})
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-stone-500">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun indice disponible pour cette quête</p>
                  </div>
                )}
              </Card>

              {/* Activité récente */}
              <Card className="p-6 bg-white/95 backdrop-blur-sm border border-amber-200/50">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-stone-600" />
                  Activité récente
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <div className="w-8 h-8 bg-stone-600 text-white rounded-full flex items-center justify-center">
                      <Camera className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-stone-800">Nouvelle preuve soumise</div>
                      <div className="text-sm text-stone-600">par Marie L. • il y a 2h</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <div className="w-8 h-8 bg-amber-600 text-white rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-stone-800">Discussion lancée</div>
                      <div className="text-sm text-stone-600">par Thomas M. • il y a 4h</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-stone-800">Indice validé</div>
                      <div className="text-sm text-stone-600">Indice #3 confirmé • il y a 6h</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="clues">
            <Card className="p-6 bg-white/95 backdrop-blur-sm border border-amber-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Compass className="w-5 h-5 text-amber-600" />
                  Indices de la quête
                </h3>
                <Badge variant="secondary">{questCluesCount} indices</Badge>
              </div>
              
              {questClues.length > 0 ? (
                <div className="space-y-4">
                  {questClues.map((clue, index) => (
                    <div key={clue.id || index} className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-stone-600 text-white rounded-full flex items-center justify-center font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-stone-800 mb-2">{clue.title}</h4>
                          <p className="text-stone-600 mb-3">{clue.description}</p>
                          
                          {clue.hint && (
                            <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-400 mb-3">
                              <div className="text-sm font-medium text-amber-800 mb-1">Indice :</div>
                              <div className="text-sm text-amber-700">{clue.hint}</div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm text-stone-500">
                            <span className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              {clue.points} points
                            </span>
                            {clue.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                Localisation requise
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Résolu
                          </Badge>
                          <Button size="sm" variant="outline">
                            Détails
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-stone-500">
                  <Compass className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <h4 className="text-lg font-medium mb-2">Aucun indice disponible</h4>
                  <p>Les indices seront révélés au fur et à mesure de l'avancement de la quête.</p>
                </div>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="evidence">
            <Card className="p-6 bg-white/95 backdrop-blur-sm border border-amber-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Camera className="w-5 h-5 text-stone-600" />
                  Preuves soumises
                </h3>
                <Button className="bg-stone-800 hover:bg-stone-900 text-amber-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Soumettre une preuve
                </Button>
              </div>
              
              <div className="text-center py-12 text-stone-500">
                <Camera className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h4 className="text-lg font-medium mb-2">Preuves en cours de chargement</h4>
                <p>Les preuves de la communauté apparaîtront ici.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="theories">
            <Card className="p-6 bg-white/95 backdrop-blur-sm border border-amber-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-600" />
                  Théories de la communauté
                </h3>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Proposer une théorie
                </Button>
              </div>
              
              <div className="text-center py-12 text-stone-500">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h4 className="text-lg font-medium mb-2">Théories en cours de chargement</h4>
                <p>Les théories de la communauté apparaîtront ici.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="discussions">
            <Card className="p-6 bg-white/95 backdrop-blur-sm border border-amber-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-stone-600" />
                  Discussions
                </h3>
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouvelle discussion
                </Button>
              </div>
              
              <div className="text-center py-12 text-stone-500">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <h4 className="text-lg font-medium mb-2">Discussions en cours de chargement</h4>
                <p>Les discussions de la communauté apparaîtront ici.</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="investigation">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/50">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-600" />
                Interface d'investigation collaborative
              </h3>
              <InvestigationInterface quest={quest} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QuestDetailPage;
